import {
	CategoriesStoreDto,
	categoriesStoreDto,
} from "@/categories/dtos/categories.store.dto";
import { useForm } from "react-hook-form";
import Form from "~/components/form";
import { valibotVigilio } from "~/libs/valibot";
import useCategoriesSocket from "../hooks/useCategoriesSocket";
import useSocketStore from "~/stores/socket.store";
import { printFileDimension } from "~/libs/upload";
import { getDimensionCategoriesFoto } from "@/categories/libs/helpers";

function CategoriesSocketIndex() {
	const { computeds } = useSocketStore();
	const categoriesStoreForm = useForm<CategoriesStoreDto>({
		resolver: valibotVigilio(categoriesStoreDto),
		mode: "all",
	});
	const { computeds: computeds2, methods } =
		useCategoriesSocket(categoriesStoreForm);

	async function onCategoriesStoreApiForm(
		categoriesStoreDto: CategoriesStoreDto,
	) {
		await methods.onCategoriesStore(categoriesStoreDto);
	}
	return (
		<div>
			<div>
				<div
					class={`w-[50px] h-[50px] rounded-full ${
						computeds.isConnect ? "bg-success" : "bg-danger"
					}`}
				/>
			</div>

			<div class="mt-6" />
			<div class="p-4">
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
						isLoading={computeds2.isLoadingStore}
						title="Agregar"
						className="mx-auto py-2 px-6"
					/>
				</Form>
				<div class="flex gap-5 flex-wrap">
					{computeds2.categories?.map((category) => {
						const dimension = getDimensionCategoriesFoto(100);
						const foto = printFileDimension(
							category.foto,
							"categories",
							dimension,
						);
						return (
							<div
								class="bg-black bg-opacity-60 rounded-md p-2"
								key={category.id}
							>
								<span>{category.id}</span>
								<span class="text-white">{category.name}</span>
								<img
									class="mx-auto"
									src={foto}
									alt={category.name}
									width={dimension}
									height={dimension}
								/>
								<button
									disabled={computeds2.isLoadingDestroy}
									class="bg-red-600 px-4 py-2 rounded-md text-white mr-2"
									type="button"
									onClick={() => methods.onCategoriesDestroy(category.id)}
									aria-label="delete to category"
								>
									Eliminar
								</button>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default CategoriesSocketIndex;
