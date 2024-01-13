import { Columns, UseTable, UseTableMethods } from "@vigilio/preact-table";
import { UsersSchema } from "../schemas/users.schema";
import { printFileDimension } from "~/libs/upload";
import { getDimensionUsersFoto } from "./helpers";
import { Link } from "wouter-preact";
import { sweetModal } from "@vigilio/sweet";
import { UsersDestroyApiMutation } from "../apis/users.destroy.api";

export type UsersIndexSecondaryPaginator = "actions" | "index";
export type UsersIndexMethods = {
	refetch: (clean?: boolean) => Promise<void>;
	usersDestroyApiMutation: UsersDestroyApiMutation;
} & UseTableMethods<UsersSchema, UsersIndexSecondaryPaginator>;

export type UsersColumnsPaginator = Columns<
	UsersSchema,
	UsersIndexSecondaryPaginator,
	UsersIndexMethods
>;
export type UsersIndexTable = UseTable<
	UsersSchema,
	UsersIndexSecondaryPaginator,
	UsersIndexMethods
>;
export const usersPaginatorColumns: UsersColumnsPaginator = [
	{ key: "id", isSort: true },
	{ key: "name", isSort: true },
	{
		key: "foto",
		cell: (props) => {
			let image =
				"https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ=";
			const dimensionUser = getDimensionUsersFoto(100);
			if (props.foto) {
				image = printFileDimension(props.foto, "users", dimensionUser);
			}

			return (
				<img
					src={image}
					width={dimensionUser}
					height={dimensionUser}
					alt={props.nick}
				/>
			);
		},
	},
	{ key: "email" },
	{ key: "nick", isSort: true },
	{
		key: "enabled",
		cell: ({ enabled }) => (
			<div
				class={`${
					enabled ? "bg-green-600" : "bg-red-600"
				} w-[15px] h-[15px] rounded-full mx-auto`}
			/>
		),
	},
	{
		key: "actions",
		cell: (props, _, methods) => {
			return (
				<div onClick={(e) => e.stopPropagation()} class="flex gap-3 ">
					<Link
						class="bg-orange-600 px-6 py-2 text-white rounded-md"
						href={`/users/${props.id}/edit`}
					>
						<i class="fa-sharp fa-solid fa-pen" />{" "}
						<span class="hidden lg:block">Editar</span>
					</Link>
					<button
						onClick={() => {
							sweetModal({
								icon: "danger",
								title: "¿Estas seguro?",
								text: `Estas seguro que deseas eliminar este usuario ${props.nick}?`,
								showCancelButton: true,
							}).then(({ isConfirmed }) => {
								if (isConfirmed) {
									methods.usersDestroyApiMutation.mutate(props.id, {
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
						disabled={methods.usersDestroyApiMutation.isLoading || false}
						class="bg-danger px-6 py-2 text-white rounded-md"
						type="button"
						aria-label="button to destroy user"
					>
						<i class="fa-solid fa-trash" />{" "}
						<span class="hidden lg:block">Eliminar</span>
					</button>
					<Link
						class="bg-blue-600 px-6 py-2 text-white rounded-md"
						href={`/users/${props.id}`}
					>
						<i class="fas fa-eye" />{" "}
						<span class="hidden lg:block"> Más información</span>
					</Link>
				</div>
			);
		},
	},
];
