import { useForm } from "react-hook-form";
import Form from "~/components/form";
import { UsersStoreDto, usersStoreDto } from "../dtos/users.store.dto";
import { usersStoreApi } from "../apis/users.store.api";
import { rolesIndexApi } from "@/roles/apis/roles.index.api";
import { useMemo } from "preact/hooks";
import { sweetModal } from "@vigilio/sweet";
import { valibotVigilio } from "~/libs/valibot";
interface UsersCreateProps {
	refetch: (clean?: boolean) => Promise<void>;
}
function UsersCreate(props: UsersCreateProps) {
	const usersStoreMutation = usersStoreApi();
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
	const usersStoreForm = useForm<UsersStoreDto>({
		resolver: valibotVigilio(usersStoreDto),
		mode: "all",
	});

	function onUsersStoreForm(usersStoreDto: UsersStoreDto) {
		usersStoreMutation.mutate(usersStoreDto, {
			onSuccess(data) {
				sweetModal({
					icon: "success",
					title: "Usuario creado correctamente",
					text: `Usuario creado correctamente ${data.user.nick}`,
				});
				usersStoreForm.reset();
				props.refetch();
			},
			onError(error) {
				if (error.body) {
					usersStoreForm.setError(error.body, {
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
	return (
		<div>
			<Form onSubmit={onUsersStoreForm} {...usersStoreForm}>
				<div class="flex gap-2">
					<Form.control
						name={"nick" as keyof UsersStoreDto}
						title="Nick"
						placeholder="nick de usuario"
					/>
					<Form.control
						name={"slug" as keyof UsersStoreDto}
						title="Nick"
						placeholder="tu-nick"
					/>
				</div>
				<div class="flex gap-2">
					<Form.control
						name={"name" as keyof UsersStoreDto}
						title="Nombre"
						placeholder="nombre de usuario"
					/>
					<Form.control
						name={"email" as keyof UsersStoreDto}
						title="Correo Electrónico"
						placeholder="corre@gmail.com"
						type="email"
					/>
				</div>
				<div class="flex gap-2">
					<Form.control
						name={"password" as keyof UsersStoreDto}
						title="Contraseña"
						placeholder="contraseña"
						type="password"
					/>
					<Form.control
						name={"dni" as keyof UsersStoreDto}
						title="Tu dni"
						placeholder="dni"
						type="tel"
					/>
				</div>
				<div class="flex gap-2">
					<Form.control.toggle
						name={"enabled" as keyof UsersStoreDto}
						title="Habilitar"
					/>
					<Form.control.select
						title="Rol"
						name={"role_id" as keyof UsersStoreDto}
						array={getRolesArray}
						options={{ valueAsNumber: true }}
						placeholder="Escoga rol de usuario"
					/>
				</div>

				<hr />
				<Form.control
					name={"address" as keyof UsersStoreDto}
					title="Dirección"
					placeholder="dirección"
				/>
				<Form.control
					name={"telephone" as keyof UsersStoreDto}
					title="Telefono"
					placeholder="XXXXXXXXX"
					type="text"
				/>
				<Form.control.file
					title="Foto"
					name={"foto" as keyof UsersStoreDto}
					multiple={false}
					accept="image/jpeg,image/webp"
					typeFile="image"
				/>

				<Form.button.submit
					isLoading={usersStoreMutation.isLoading || false}
					title="Agregar"
					className="mx-auto py-2 px-6"
				/>
			</Form>
		</div>
	);
}

export default UsersCreate;
