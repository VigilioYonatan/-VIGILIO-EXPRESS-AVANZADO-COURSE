import { useForm } from "react-hook-form";
import { RolesUpdateDto, rolesUpdateDto } from "../dtos/roles.update.dto";
import { sweetModal } from "@vigilio/sweet";
import Form from "~/components/form";
import { rolesUpdateApi } from "../apis/roles.update.api";
import { rolesShowApi } from "../apis/roles.show.api";
import { valibotVigilio } from "~/libs/valibot";
import { useMemo } from "preact/hooks";

interface RolesEditProps {
	params: { id: string };
}
function RolesEdit(props: RolesEditProps) {
	const rolesShowApiShow = rolesShowApi(props.params.id);

	let component = null;
	if (rolesShowApiShow.isLoading) {
		component = <span>Cargando</span>;
	}
	if (rolesShowApiShow.isError) {
		component = <span>Error</span>;
	}
	if (rolesShowApiShow.isSuccess) {
		const role = rolesShowApiShow.data!.role;
		const rolesUpdateMutation = rolesUpdateApi(role.id);

		const rolesUpdateForm = useForm<RolesUpdateDto>({
			resolver: valibotVigilio(rolesUpdateDto),
			mode: "all",
			values: useMemo(() => {
				const { id, createdAt, updatedAt, ...rest } = role;
				return rest;
			}, []),
		});

		function onRolesUpdateForm(data: RolesUpdateDto) {
			rolesUpdateMutation.mutate(data, {
				onSuccess(data) {
					sweetModal({
						icon: "success",
						title: "Actualizado correctamente",
						text: `Felicidades se actualizó correctamente ${data.role.name}`,
					}).then(() => {
						window.location.reload();
					});
					// rolesUpdateForm.reset();
				},
				onError(error) {
					if (error.body) {
						rolesUpdateForm.setError(error.body, {
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

		component = (
			<>
				<div class="mb-6 mt-2">
					<h1 class="text-primary font-bold uppercase text-xl mt-6">
						Editar {role.name}
					</h1>
				</div>
				<Form onSubmit={onRolesUpdateForm} {...rolesUpdateForm}>
					<div class="flex gap-2">
						<Form.control
							name={"name" as keyof RolesUpdateDto}
							title="Nombre"
							placeholder="Nombre de rol"
						/>
						<Form.control
							name={"slug" as keyof RolesUpdateDto}
							title="Slug"
							placeholder="tu-nick"
						/>
					</div>
					<Form.button.submit
						ico={<i class="fas fa-pen" />}
						isLoading={rolesUpdateMutation.isLoading || false}
						title="Editar"
						className="mx-auto py-2 px-6"
					/>
				</Form>
			</>
		);
	}

	return <div class="px-4">{component}</div>;
}

export default RolesEdit;
