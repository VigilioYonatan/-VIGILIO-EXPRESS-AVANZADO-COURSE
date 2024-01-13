import { Columns, UseTable, UseTableMethods } from "@vigilio/preact-table";
import { CategoriesSchema } from "../schemas/categories.schema";
import { Link } from "wouter-preact";
import { sweetModal } from "@vigilio/sweet";
import { CategoriesDestroyApiMutation } from "../apis/categories.destroy.api";
import { printFileDimension } from "~/libs/upload";
import { getDimensionCategoriesFoto } from "./helpers";

export type CategoriesIndexSecondaryPaginator = "actions" | "index";
export type CategoriesIndexMethods = {
	refetch: (clean?: boolean) => Promise<void>;
	categoriesDestroyApiMutation: CategoriesDestroyApiMutation;
} & UseTableMethods<CategoriesSchema, CategoriesIndexSecondaryPaginator>;

export type CategoriesColumnsPaginator = Columns<
	CategoriesSchema,
	CategoriesIndexSecondaryPaginator,
	CategoriesIndexMethods
>;
export type CategoriesIndexTable = UseTable<
	CategoriesSchema,
	CategoriesIndexSecondaryPaginator,
	CategoriesIndexMethods
>;
export const categoriesPaginatorColumns: CategoriesColumnsPaginator = [
	{ key: "id", isSort: true },
	{ key: "name", isSort: true },
	{
		key: "foto",
		cell: (props) => {
			const dimension = getDimensionCategoriesFoto(100);
			const foto = printFileDimension(props.foto, "categories", dimension);

			return (
				<img
					class="mx-auto"
					src={foto}
					alt={props.name}
					width={dimension}
					height={dimension}
				/>
			);
		},
	},
	{
		key: "actions",
		cell: (props, _, methods) => {
			return (
				<div
					onClick={(e) => e.stopPropagation()}
					class="flex justify-center gap-3 "
				>
					<Link
						class="bg-orange-600 px-6 py-2 text-white rounded-md"
						href={`/categories/${props.id}/edit`}
					>
						<i class="fa-sharp fa-solid fa-pen" />{" "}
						<span class="hidden lg:block">Editar</span>
					</Link>
					<button
						onClick={() => {
							sweetModal({
								icon: "danger",
								title: "¿Estas seguro?",
								text: `Estas seguro que deseas eliminar este producto ${props.name}?`,
								showCancelButton: true,
							}).then(({ isConfirmed }) => {
								if (isConfirmed) {
									methods.categoriesDestroyApiMutation.mutate(props.id, {
										onSuccess: (data) => {
											sweetModal({
												icon: "success",
												title: "Eliminado correctamente",
												text: data.message,
											});
											methods.refetch();
										},
										onError: (error) => {
											sweetModal({
												icon: "danger",
												title: "Hubo un error en realizar esta acción",
												text: JSON.stringify(error),
											});
										},
									});
								}
							});
						}}
						disabled={methods.categoriesDestroyApiMutation.isLoading || false}
						class="bg-danger px-6 py-2 text-white rounded-md"
						type="button"
						aria-label="button to destroy producto"
					>
						<i class="fa-solid fa-trash" />{" "}
						<span class="hidden lg:block">Eliminar</span>
					</button>
					<Link
						class="bg-blue-600 px-6 py-2 text-white rounded-md"
						href={`/categories/${props.id}`}
					>
						<i class="fas fa-eye" />{" "}
						<span class="hidden lg:block"> Más información</span>
					</Link>
				</div>
			);
		},
	},
];
