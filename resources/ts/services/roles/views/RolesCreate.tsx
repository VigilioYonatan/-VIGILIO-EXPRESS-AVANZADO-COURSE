import { useForm } from "react-hook-form";
import Form from "~/components/form";
import { RolesStoreDto, rolesStoreDto } from "../dtos/roles.store.dto";
import { rolesStoreApi } from "../apis/roles.store.api";
import { sweetModal } from "@vigilio/sweet";
import { valibotVigilio } from "~/libs/valibot";
interface UsersCreateProps {
	refetch: (clean?: boolean) => Promise<void>;
}
function UsersCreate(props: UsersCreateProps) {
	const rolesStoreApiMutation = rolesStoreApi();

	const rolesStoreApiForm = useForm<RolesStoreDto>({
		resolver: valibotVigilio(rolesStoreDto),
		mode: "all",
	});

	function onRolesStoreApiForm(rolesStoreDto: RolesStoreDto) {
		rolesStoreApiMutation.mutate(rolesStoreDto, {
			onSuccess(data) {
				sweetModal({
					icon: "success",
					title: "Rol creado correctamente",
					text: `Rol creado correctamente ${data.role.name}`,
				});
				rolesStoreApiForm.reset();
				props.refetch();
			},
			onError(error) {
				if (error.body) {
					rolesStoreApiForm.setError(error.body, {
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
			<Form onSubmit={onRolesStoreApiForm} {...rolesStoreApiForm}>
				<div class="flex gap-2">
					<Form.control
						name={"name" as keyof RolesStoreDto}
						title="Nombre"
						placeholder="Nombre de rol"
					/>
					<Form.control
						name={"slug" as keyof RolesStoreDto}
						title="Slug"
						placeholder="tu-nick"
					/>
				</div>
				<Form.button.submit
					isLoading={rolesStoreApiMutation.isLoading || false}
					title="Agregar"
					className="mx-auto py-2 px-6"
				/>
			</Form>
		</div>
	);
}

export default UsersCreate;
