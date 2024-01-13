import { Columns, UseTable, UseTableMethods } from "@vigilio/preact-table";
import { RolesSchema } from "../schemas/roles.schema";
import { Link } from "wouter-preact";
import { sweetModal } from "@vigilio/sweet";
import { RolesDestroyApiMutation } from "../apis/roles.destroy.api";

export type RolesIndexSecondaryPaginator = "actions" | "index";
export type RolesIndexMethods = {
	refetch: (clean?: boolean) => Promise<void>;
	rolesDestroyApiMutation: RolesDestroyApiMutation;
} & UseTableMethods<RolesSchema, RolesIndexSecondaryPaginator>;

export type RolesColumnsPaginator = Columns<
	RolesSchema,
	RolesIndexSecondaryPaginator,
	RolesIndexMethods
>;
export type RolesIndexTable = UseTable<
	RolesSchema,
	RolesIndexSecondaryPaginator,
	RolesIndexMethods
>;
export const rolesPaginatorColumns: RolesColumnsPaginator = [
	{ key: "id", isSort: true },
	{ key: "name", isSort: true },

	{
		key: "actions",
		cell: (props, _, methods) => {
			return (
				<div onClick={(e) => e.stopPropagation()} class="flex gap-3 ">
					<Link
						class="bg-orange-600 px-6 py-2 text-white rounded-md"
						href={`/roles/${props.id}/edit`}
					>
						<i class="fa-sharp fa-solid fa-pen" />{" "}
						<span class="hidden lg:block">Editar</span>
					</Link>
					<button
						onClick={() => {
							sweetModal({
								icon: "danger",
								title: "¿Estas seguro?",
								text: `Estas seguro que deseas eliminar este rol ${props.name}?`,
								showCancelButton: true,
							}).then(({ isConfirmed }) => {
								if (isConfirmed) {
									methods.rolesDestroyApiMutation.mutate(props.id, {
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
						disabled={methods.rolesDestroyApiMutation.isLoading || false}
						class="bg-danger px-6 py-2 text-white rounded-md"
						type="button"
						aria-label="button to destroy role"
					>
						<i class="fa-solid fa-trash" />{" "}
						<span class="hidden lg:block">Eliminar</span>
					</button>
					<Link
						class="bg-blue-600 px-6 py-2 text-white rounded-md"
						href={`/roles/${props.id}`}
					>
						<i class="fas fa-eye" />{" "}
						<span class="hidden lg:block"> Más información</span>
					</Link>
				</div>
			);
		},
	},
];
