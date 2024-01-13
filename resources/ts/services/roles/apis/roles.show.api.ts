import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { RolesSchemaFromServer } from "../schemas/roles.schema";
interface RolesShowAPI {
	success: true;
	role: RolesSchemaFromServer;
}
export function rolesShowApi(id: string) {
	return useQuery(`/roles/${id}`, async (url) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
		const result: RolesShowAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}
