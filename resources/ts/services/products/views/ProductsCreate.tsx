import { useForm } from "react-hook-form";
import Form from "~/components/form";
import { ProductsStoreDto, productsStoreDto } from "../dtos/products.store.dto";
import { productsStoreApi } from "../apis/products.store.api";
import { sweetModal } from "@vigilio/sweet";
import { valibotVigilio } from "~/libs/valibot";
import { categoriesIndexApi } from "@/categories/apis/categories.index.api";
import { useMemo } from "preact/hooks";
import { useEffect } from "react";
import { slug } from "@vigilio/express-core/helpers";
interface UsersCreateProps {
	refetch: (clean?: boolean) => Promise<void>;
}
function UsersCreate(props: UsersCreateProps) {
	const productsStoreApiMutation = productsStoreApi();
	const categoriesIndexApiQuery = categoriesIndexApi();
	const getCategoriesArray = useMemo(
		() =>
			categoriesIndexApiQuery.data?.data
				? categoriesIndexApiQuery.data.data.map((role) => ({
						key: role.id,
						value: role.name,
				  }))
				: [],
		[categoriesIndexApiQuery.data],
	);
	const productsStoreForm = useForm<ProductsStoreDto>({
		resolver: valibotVigilio(productsStoreDto),
		mode: "all",
	});

	function onProductsStoreApiForm(productsStoreDto: ProductsStoreDto) {
		productsStoreApiMutation.mutate(productsStoreDto, {
			onSuccess(data) {
				sweetModal({
					icon: "success",
					title: "producto creado correctamente",
					text: `producto creado correctamente ${data.product.name}`,
				});
				productsStoreForm.reset();
				props.refetch();
			},
			onError(error) {
				if (error.body) {
					productsStoreForm.setError(error.body, {
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
	const name = productsStoreForm.watch("name");
	useEffect(() => {
		if (name) {
			productsStoreForm.setValue("slug", slug(name));
		}
	}, [productsStoreForm, name]);
	return (
		<div>
			<Form onSubmit={onProductsStoreApiForm} {...productsStoreForm}>
				<div class="flex gap-2">
					<Form.control
						name={"name" as keyof ProductsStoreDto}
						title="Nombre"
						placeholder="Nombre de Producto"
					/>
					<Form.control
						name={"slug" as keyof ProductsStoreDto}
						title="Slug"
						placeholder="tu-nick"
					/>
				</div>
				<div class="flex gap-2">
					<Form.control
						name={"price" as keyof ProductsStoreDto}
						title="Precio"
						type="number"
						placeholder="precio de Producto"
						options={{ valueAsNumber: true }}
					/>
					<Form.control
						name={"stock" as keyof ProductsStoreDto}
						title="Stock"
						type="number"
						placeholder="1"
						options={{ valueAsNumber: true }}
					/>
				</div>
				<div class="flex gap-2">
					<Form.control
						name={"discount" as keyof ProductsStoreDto}
						title="Descuento"
						type="number"
						placeholder="0.1"
						options={{ valueAsNumber: true }}
					/>
					<Form.control.select
						name={"category_id" as keyof ProductsStoreDto}
						array={getCategoriesArray}
						title="Categoría"
						placeholder="Seleccionar  categoria"
						options={{ valueAsNumber: true }}
					/>
				</div>
				<Form.control.area
					name={"description" as keyof ProductsStoreDto}
					title="Descripcion"
					placeholder="tu descripcion"
				/>
				<Form.control.toggle
					name={"enabled" as keyof ProductsStoreDto}
					title="Habilitar"
				/>
				<Form.control.file
					name={"images" as keyof ProductsStoreDto}
					title="Imagenes"
					multiple
					accept="image/jpeg,image/webp,image/png,image/jpg"
					typeFile="image"
				/>
				<Form.button.submit
					isLoading={productsStoreApiMutation.isLoading || false}
					title="Agregar"
					className="mx-auto py-2 px-6"
				/>
			</Form>
		</div>
	);
}

export default UsersCreate;
