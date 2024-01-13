import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { UsersEntitySchemaFormServer } from "../schemas/users.schema";
interface UsersIndexAPI {
	success: true;
	data: UsersEntitySchemaFormServer[];
}
export function usersIndexApi() {
	return useQuery("/users", async (url) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
		const result: UsersIndexAPI = await response.json();
		return result;
	});
}
