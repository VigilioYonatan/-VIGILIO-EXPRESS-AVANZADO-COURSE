import { useForm } from "react-hook-form";
import {
	CategoriesUpdateDto,
	CategoriesUpdateFotoDto,
	categoriesUpdateDto,
	categoriesUpdateFotoDto,
} from "../dtos/categories.update.dto";
import { sweetModal } from "@vigilio/sweet";
import Form from "~/components/form";
import {
	categoriesUpdateApi,
	categoriesUpdateFotoApi,
} from "../apis/categories.update.api";
import { categoriesShowApi } from "../apis/categories.show.api";
import { valibotVigilio } from "~/libs/valibot";
import { useEffect, useMemo } from "preact/hooks";
import { getFilesEdit } from "~/libs/upload";
import { getDimensionCategoriesFoto } from "../libs/helpers";

interface CategoriesEditProps {
	params: { id: string };
}
function CategoriesEdit(props: CategoriesEditProps) {
	const categoriesShowApiShow = categoriesShowApi(props.params.id);

	let component = null;
	if (categoriesShowApiShow.isLoading) {
		component = <span>Cargando</span>;
	}
	if (categoriesShowApiShow.isError) {
		component = <span>Error</span>;
	}
	if (categoriesShowApiShow.isSuccess) {
		const category = categoriesShowApiShow.data!.category;
		const categoriesUpdateFotoMutation = categoriesUpdateFotoApi(category.id);
		const categoriesUpdateMutation = categoriesUpdateApi(category.id);

		const categoriesUpdateForm = useForm<CategoriesUpdateDto>({
			resolver: valibotVigilio(categoriesUpdateDto),
			mode: "all",
			values: useMemo(() => {
				const { id, createdAt, updatedAt, foto, ...rest } = category;
				return rest;
			}, []),
		});
		const categoriesUpdateFotoForm = useForm<CategoriesUpdateFotoDto>({
			resolver: valibotVigilio(categoriesUpdateFotoDto),
			mode: "all",
		});

		async function initialUpdateFoto() {
			const foto = await getFilesEdit(
				category.foto,
				"categories",
				getDimensionCategoriesFoto(500),
			);
			categoriesUpdateFotoForm.setValue("foto", foto);
		}
		useEffect(() => {
			initialUpdateFoto();
		}, []);

		function onCategoriesUpdateForm(data: CategoriesUpdateDto) {
			categoriesUpdateMutation.mutate(data, {
				onSuccess(data) {
					sweetModal({
						icon: "success",
						title: "Actualizado correctamente",
						text: `Felicidades se actualizó correctamente ${data.category.name}`,
					}).then(() => {
						window.location.reload();
					});
				},
				onError(error) {
					if (error.body) {
						categoriesUpdateForm.setError(error.body, {
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
		function onCategoriesUpdateFotoForm(data: CategoriesUpdateFotoDto) {
			categoriesUpdateFotoMutation
				.mutate({
					...data,
					name: category.name,
				})
				.then(() => {
					window.location.reload();
				});
		}
		component = (
			<>
				<div class="mb-6 mt-2">
					<h1 class="text-primary font-bold uppercase text-xl mt-6">
						Editar {category.name}
					</h1>
				</div>
				<Form onSubmit={onCategoriesUpdateForm} {...categoriesUpdateForm}>
					<div class="flex gap-2">
						<Form.control
							name={"name" as keyof CategoriesUpdateDto}
							title="Nombre"
							placeholder="Nombre de Categoryo"
						/>
						<Form.control
							name={"slug" as keyof CategoriesUpdateDto}
							title="Slug"
							placeholder="tu-nick"
						/>
					</div>
					<Form.button.submit
						ico={<i class="fas fa-pen" />}
						isLoading={categoriesUpdateMutation.isLoading || false}
						title="Editar"
						className="mx-auto py-2 px-6"
					/>
				</Form>
				<hr />
				<h2 class="text-primary font-bold uppercase text-xl mt-6">
					Editar Foto
				</h2>
				<Form
					onSubmit={onCategoriesUpdateFotoForm}
					{...categoriesUpdateFotoForm}
				>
					<Form.control.file
						title="Foto"
						name={"foto" as keyof CategoriesUpdateFotoDto}
						multiple
						accept="image/jpeg,image/webp"
						typeFile="image"
					/>
					<Form.button.submit
						isLoading={categoriesUpdateFotoMutation.isLoading || false}
						title="Editar Foto"
						className="mx-auto py-2 px-6"
					/>
				</Form>
			</>
		);
	}

	return <div class="px-4">{component}</div>;
}

export default CategoriesEdit;
