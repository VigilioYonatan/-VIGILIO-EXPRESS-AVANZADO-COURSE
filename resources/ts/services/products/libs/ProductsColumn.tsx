import { Columns, UseTable, UseTableMethods } from "@vigilio/preact-table";
import { ProductsSchema } from "../schemas/products.schema";
import { Link } from "wouter-preact";
import { sweetModal } from "@vigilio/sweet";
import { ProductsDestroyApiMutation } from "../apis/products.destroy.api";
import { printProductsImages } from "./helpers";
import permissionAdminGuard from "@/auth/guards/permission-admin.guard";

export type ProductsIndexSecondaryPaginator = "actions" | "index";
export type ProductsIndexMethods = {
	refetch: (clean?: boolean) => Promise<void>;
	productsDestroyApiMutation: ProductsDestroyApiMutation;
} & UseTableMethods<ProductsSchema, ProductsIndexSecondaryPaginator>;

export type ProductsColumnsPaginator = Columns<
	ProductsSchema,
	ProductsIndexSecondaryPaginator,
	ProductsIndexMethods
>;
export type ProductsIndexTable = UseTable<
	ProductsSchema,
	ProductsIndexSecondaryPaginator,
	ProductsIndexMethods
>;
export const productsPaginatorColumns: ProductsColumnsPaginator = [
	{ key: "id", isSort: true },
	{ key: "name", isSort: true },
	{ key: "price", isSort: true },
	{
		key: "images",
		cell: (props) => {
			const { images, dimension } = printProductsImages(props.images, 300);
			return (
				<img
					alt={props.name}
					src={images}
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
				<div onClick={(e) => e.stopPropagation()} class="flex gap-3 ">
					{permissionAdminGuard() ? (
						<>
							<Link
								class="bg-orange-600 px-6 py-2 text-white rounded-md"
								href={`/products/${props.id}/edit`}
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
											methods.productsDestroyApiMutation.mutate(props.id, {
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
								disabled={methods.productsDestroyApiMutation.isLoading || false}
								class="bg-danger px-6 py-2 text-white rounded-md"
								type="button"
								aria-label="button to destroy producto"
							>
								<i class="fa-solid fa-trash" />{" "}
								<span class="hidden lg:block">Eliminar</span>
							</button>
						</>
					) : null}
					<Link
						class="bg-blue-600 px-6 py-2 text-white rounded-md"
						href={`/products/${props.id}`}
					>
						<i class="fas fa-eye" />{" "}
						<span class="hidden lg:block"> Más información</span>
					</Link>
				</div>
			);
		},
	},
];
