import { rolesShowApi } from "../apis/roles.show.api";
interface RolesShowProps {
	params: { id: string };
}
function RolesShow(props: RolesShowProps) {
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

		component = <span>{JSON.stringify(role)}</span>;
	}

	return <div class="px-4">{component}</div>;
}

export default RolesShow;
