import { rolesIndexApi } from "@/roles/apis/roles.index.api";
import { useEffect, useMemo } from "preact/hooks";
import { useForm } from "react-hook-form";
import {
	UsersUpdateDto,
	UsersUpdateFotoDto,
	usersUpdateDto,
	usersUpdateFotoDto,
} from "../dtos/users.update.dto";
import { sweetModal } from "@vigilio/sweet";
import Form from "~/components/form";
import { usersUpdateApi, usersUpdateFotoApi } from "../apis/users.update.api";
import { usersShowApi } from "../apis/users.show.api";
import { getFilesEdit } from "~/libs/upload";
import { getDimensionUsersFoto } from "../libs/helpers";
import { valibotVigilio } from "~/libs/valibot";

interface UsersEditProps {
	params: { id: string };
}
function UsersEdit(props: UsersEditProps) {
	const usersShowApiShow = usersShowApi(props.params.id);

	let component = null;
	if (usersShowApiShow.isLoading) {
		component = <span>Cargando</span>;
	}
	if (usersShowApiShow.isError) {
		component = <span>Error</span>;
	}
	if (usersShowApiShow.isSuccess) {
		const user = usersShowApiShow.data!.user;
		const usersUpdateMutation = usersUpdateApi(user.id);
		const usersUpdateFotoMutation = usersUpdateFotoApi(user.id);
		const rolesIndexApiQuery = rolesIndexApi();
		const getRolesArray = useMemo(
			() =>
				rolesIndexApiQuery.data?.data
					? rolesIndexApiQuery.data.data.map((role) => ({
							key: role.id,
							value: role.name,
					  }))
					: [],
			[rolesIndexApiQuery.data],
		);
		const usersUpdateForm = useForm<UsersUpdateDto>({
			resolver: valibotVigilio(usersUpdateDto),
			mode: "all",
			values: useMemo(() => {
				const { id, foto, createdAt, updatedAt, profile, ...rest } = user;
				const { id: idProfile, ...restProfile } = profile;
				return {
					...rest,
					...restProfile,
				};
			}, []),
		});
		const usersUpdateFotoForm = useForm<UsersUpdateFotoDto>({
			resolver: valibotVigilio(usersUpdateFotoDto),
			mode: "all",
		});

		async function initialUpdateFoto() {
			if (user.foto) {
				const foto = await getFilesEdit(
					user.foto,
					"users",
					getDimensionUsersFoto(300),
				);
				usersUpdateFotoForm.setValue("foto", foto);
			}
		}
		useEffect(() => {
			initialUpdateFoto();
		}, []);

		function onUsersUpdateForm(data: UsersUpdateDto) {
			usersUpdateMutation.mutate(data, {
				onSuccess(data) {
					sweetModal({
						icon: "success",
						title: "Actualizado correctamente",
						text: `Felicidades se actualizó correctamente ${data.user.nick}`,
					}).then(() => {
						window.location.reload();
					});
				},
				onError(error) {
					if (error.body) {
						usersUpdateForm.setError(error.body, {
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

		function onUsersUpdateFotoForm(data: UsersUpdateFotoDto) {
			usersUpdateFotoMutation
				.mutate({
					...data,
					nick: user.nick,
				})
				.then(() => {
					window.location.reload();
				});
		}
		component = (
			<>
				<div class="mb-6 mt-2">
					<h1 class="text-primary font-bold uppercase text-xl mt-6">
						Editar {user.nick}
					</h1>
				</div>
				<Form onSubmit={onUsersUpdateForm} {...usersUpdateForm}>
					<div class="flex gap-2">
						<Form.control
							name={"nick" as keyof UsersUpdateDto}
							title="Nick"
							placeholder="nick de usuario"
						/>
						<Form.control
							name={"slug" as keyof UsersUpdateDto}
							title="Nick"
							placeholder="tu-nick"
						/>
					</div>
					<div class="flex gap-2">
						<Form.control
							name={"name" as keyof UsersUpdateDto}
							title="Nombre"
							placeholder="nombre de usuario"
						/>
						<Form.control
							name={"email" as keyof UsersUpdateDto}
							title="Correo Electrónico"
							placeholder="corre@gmail.com"
							type="email"
						/>
					</div>
					<div class="flex gap-2">
						<Form.control
							name={"password" as keyof UsersUpdateDto}
							title="Contraseña"
							placeholder="contraseña"
							type="password"
							disabled
						/>
						<Form.control
							name={"dni" as keyof UsersUpdateDto}
							title="Tu dni"
							placeholder="dni"
							type="tel"
						/>
					</div>
					<div class="flex gap-2">
						<Form.control.toggle
							name={"enabled" as keyof UsersUpdateDto}
							title="Habilitar"
						/>
						<Form.control.select
							title="Rol"
							name={"role_id" as keyof UsersUpdateDto}
							array={getRolesArray}
							options={{ valueAsNumber: true }}
							placeholder="Escoga rol de usuario"
						/>
					</div>

					<hr />
					<Form.control
						name={"address" as keyof UsersUpdateDto}
						title="Dirección"
						placeholder="dirección"
					/>
					<Form.control
						name={"telephone" as keyof UsersUpdateDto}
						title="Telefono"
						placeholder="XXXXXXXXX"
						type="text"
					/>

					<Form.button.submit
						ico={<i class="fas fa-pen" />}
						isLoading={usersUpdateMutation.isLoading || false}
						title="Editar"
						className="mx-auto py-2 px-6"
					/>
				</Form>

				<hr />
				<h2 class="text-primary font-bold uppercase text-xl mt-6">
					Editar Foto
				</h2>
				<Form onSubmit={onUsersUpdateFotoForm} {...usersUpdateFotoForm}>
					<Form.control.file
						title="Foto"
						name={"foto" as keyof UsersUpdateFotoDto}
						multiple
						accept="image/jpeg,image/webp"
						typeFile="image"
					/>
					<Form.button.submit
						isLoading={usersUpdateFotoMutation.isLoading || false}
						title="Editar Foto"
						className="mx-auto py-2 px-6"
					/>
				</Form>
			</>
		);
	}

	return <div class="px-4">{component}</div>;
}

export default UsersEdit;
