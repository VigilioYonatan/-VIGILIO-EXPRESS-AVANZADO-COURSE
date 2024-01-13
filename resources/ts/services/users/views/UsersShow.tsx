import { usersShowApi } from "../apis/users.show.api";
interface UsersShowProps {
	params: { id: string };
}
function UsersShow(props: UsersShowProps) {
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

		component = <span>{JSON.stringify(user)}</span>;
	}

	return <div class="px-4">{component}</div>;
}

export default UsersShow;
