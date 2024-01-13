import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { UsersEntitySchemaFormServer } from "../schemas/users.schema";
interface UsersShowAPI {
	success: true;
	user: UsersEntitySchemaFormServer;
}
export function usersShowApi(id: string) {
	return useQuery(`/users/${id}`, async (url) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
		const result: UsersShowAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}
