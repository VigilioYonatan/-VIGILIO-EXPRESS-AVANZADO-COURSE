import { useForm } from "react-hook-form";
import Form from "~/components/form";
import {
	CategoriesStoreDto,
	categoriesStoreDto,
} from "../dtos/categories.store.dto";
import { categoriesStoreApi } from "../apis/categories.store.api";
import { sweetModal } from "@vigilio/sweet";
import { valibotVigilio } from "~/libs/valibot";
import { useEffect } from "react";
import { slug } from "@vigilio/express-core/helpers";
interface categoriesCreateProps {
	refetch: (clean?: boolean) => Promise<void>;
}
function categoriesCreate(props: categoriesCreateProps) {
	const categoriesStoreApiMutation = categoriesStoreApi();

	const categoriesStoreForm = useForm<CategoriesStoreDto>({
		resolver: valibotVigilio(categoriesStoreDto),
		mode: "all",
	});

	function onCategoriesStoreApiForm(categoriesStoreDto: CategoriesStoreDto) {
		categoriesStoreApiMutation.mutate(categoriesStoreDto, {
			onSuccess(data) {
				sweetModal({
					icon: "success",
					title: "categoría creado correctamente",
					text: `categoría creado correctamente ${data.category.name}`,
				}).then(() => {
					categoriesStoreForm.reset();
					props.refetch();
				});
			},
			onError(error) {
				if (error.body) {
					categoriesStoreForm.setError(error.body, {
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
	const name = categoriesStoreForm.watch("name");
	useEffect(() => {
		if (name) {
			categoriesStoreForm.setValue("slug", slug(name));
		}
	}, [categoriesStoreForm, name]);
	return (
		<div>
			<Form onSubmit={onCategoriesStoreApiForm} {...categoriesStoreForm}>
				<div class="flex gap-2">
					<Form.control
						name={"name" as keyof CategoriesStoreDto}
						title="Nombre"
						placeholder="Nombre de Categoría"
					/>
					<Form.control
						name={"slug" as keyof CategoriesStoreDto}
						title="Slug"
						placeholder="tu-categoría"
					/>
				</div>
				<Form.control.file
					title="Foto"
					name={"foto" as keyof CategoriesStoreDto}
					multiple={false}
					accept="image/jpeg,image/webp,image/png,image/jpg"
					typeFile="image"
				/>
				<Form.button.submit
					isLoading={categoriesStoreApiMutation.isLoading || false}
					title="Agregar"
					className="mx-auto py-2 px-6"
				/>
			</Form>
		</div>
	);
}

export default categoriesCreate;
