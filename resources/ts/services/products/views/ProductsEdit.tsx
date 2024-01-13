import { useForm } from "react-hook-form";
import {
    ProductsUpdateDto,
    ProductsUpdateImagesDto,
    productsUpdateDto,
    productsUpdateImagesDto,
} from "../dtos/products.update.dto";
import { sweetModal } from "@vigilio/sweet";
import Form from "~/components/form";
import {
    productsUpdateApi,
    productsUpdateImagesApi,
} from "../apis/products.update.api";
import { productsShowApi } from "../apis/products.show.api";
import { valibotVigilio } from "~/libs/valibot";
import { useEffect, useMemo } from "preact/hooks";
import { categoriesIndexApi } from "@/categories/apis/categories.index.api";
import { getFilesEdit } from "~/libs/upload";
import permissionAdminGuard from "@/auth/guards/permission-admin.guard";
import { getDimensionProductsImages } from "../libs/helpers";

interface ProductsEditProps {
    params: { id: string };
}
function ProductsEdit(props: ProductsEditProps) {
    if (!permissionAdminGuard()) {
        window.history.back();
        return null;
    }
    const productsShowApiShow = productsShowApi(props.params.id);
    const categoriesIndexApiQuery = categoriesIndexApi();
    const getCategoriesArray = useMemo(
        () =>
            categoriesIndexApiQuery.data?.data
                ? categoriesIndexApiQuery.data.data.map((product) => ({
                      key: product.id,
                      value: product.name,
                  }))
                : [],
        [categoriesIndexApiQuery.data]
    );
    let component = null;
    if (productsShowApiShow.isLoading) {
        component = <span>Cargando</span>;
    }
    if (productsShowApiShow.isError) {
        component = <span>Error</span>;
    }
    if (productsShowApiShow.isSuccess) {
        const product = productsShowApiShow.data!.product;
        const productsUpdateImagesMutation = productsUpdateImagesApi(
            product.id
        );
        const productsUpdateMutation = productsUpdateApi(product.id);

        const productsUpdateForm = useForm<ProductsUpdateDto>({
            resolver: valibotVigilio(productsUpdateDto),
            mode: "all",
            values: useMemo(() => {
                const { id, createdAt, updatedAt, images, ...rest } = product;
                return rest;
            }, []),
        });
        const productsUpdateImagesForm = useForm<ProductsUpdateImagesDto>({
            resolver: valibotVigilio(productsUpdateImagesDto),
            mode: "all",
        });

        async function initialUpdateImages() {
            const images = await getFilesEdit(
                product.images,
                "products",
                getDimensionProductsImages(500)
            );
            productsUpdateImagesForm.setValue("images", images);
        }
        useEffect(() => {
            initialUpdateImages();
        }, []);

        function onProductsUpdateForm(data: ProductsUpdateDto) {
            productsUpdateMutation.mutate(data, {
                onSuccess(data) {
                    sweetModal({
                        icon: "success",
                        title: "Actualizado correctamente",
                        text: `Felicidades se actualizó correctamente ${data.product.name}`,
                    }).then(() => {
                        window.location.reload();
                    });
                },
                onError(error) {
                    if (error.body) {
                        productsUpdateForm.setError(error.body, {
                            message: error.message,
                        });
                        return;
                    }
                    sweetModal({
                        icon: "success",
                        title: "Hubo un error",
                        text: JSON.stringify(error),
                    });
                },
            });
        }
        function onProductsUpdateImagesForm(data: ProductsUpdateImagesDto) {
            productsUpdateImagesMutation.mutate({
                ...data,
                name: product.name,
            });
        }
        component = (
            <>
                <div class="mb-6 mt-2">
                    <h1 class="text-primary font-bold uppercase text-xl mt-6">
                        Editar {product.name}
                    </h1>
                </div>
                <Form onSubmit={onProductsUpdateForm} {...productsUpdateForm}>
                    <div class="flex gap-2">
                        <Form.control
                            name={"name" as keyof ProductsUpdateDto}
                            title="Nombre"
                            placeholder="Nombre de Producto"
                        />
                        <Form.control
                            name={"slug" as keyof ProductsUpdateDto}
                            title="Slug"
                            placeholder="tu-nick"
                        />
                    </div>
                    <div class="flex gap-2">
                        <Form.control
                            name={"price" as keyof ProductsUpdateDto}
                            title="Precio"
                            type="number"
                            placeholder="precio de Producto"
                            options={{ valueAsNumber: true }}
                        />
                        <Form.control
                            name={"stock" as keyof ProductsUpdateDto}
                            title="Stock"
                            type="number"
                            placeholder="1"
                            options={{ valueAsNumber: true }}
                        />
                    </div>
                    <div class="flex gap-2">
                        <Form.control
                            name={"discount" as keyof ProductsUpdateDto}
                            title="Descuento"
                            type="number"
                            placeholder="0.1"
                            options={{ valueAsNumber: true }}
                        />
                        <Form.control.select
                            name={"category_id" as keyof ProductsUpdateDto}
                            array={getCategoriesArray}
                            title="Categoría"
                            placeholder="Seleccionar  categoria"
                            options={{ valueAsNumber: true }}
                        />
                    </div>
                    <Form.control.area
                        name={"description" as keyof ProductsUpdateDto}
                        title="Descripcion"
                        placeholder="tu descripcion"
                    />
                    <Form.control.toggle
                        name={"enabled" as keyof ProductsUpdateDto}
                        title="Habilitar"
                    />

                    <Form.button.submit
                        ico={<i class="fas fa-pen" />}
                        isLoading={productsUpdateMutation.isLoading || false}
                        title="Editar"
                        className="mx-auto py-2 px-6"
                    />
                </Form>
                <hr />
                <h2 class="text-primary font-bold uppercase text-xl mt-6">
                    Editar Images
                </h2>
                <Form
                    onSubmit={onProductsUpdateImagesForm}
                    {...productsUpdateImagesForm}
                >
                    <Form.control.file
                        title="Images"
                        name={"images" as keyof ProductsUpdateImagesDto}
                        multiple
                        accept="image/jpeg,image/webp"
                        typeFile="image"
                    />
                    <Form.button.submit
                        isLoading={
                            productsUpdateImagesMutation.isLoading || false
                        }
                        title="Editar Images"
                        className="mx-auto py-2 px-6"
                    />
                </Form>
            </>
        );
    }

    return <div class="px-4">{component}</div>;
}

export default ProductsEdit;
