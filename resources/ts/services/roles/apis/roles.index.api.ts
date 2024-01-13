import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { RolesSchemaFromServer } from "../schemas/roles.schema";
interface RolesIndexAPI {
	success: true;
	data: RolesSchemaFromServer[];
}
export function rolesIndexApi() {
	return useQuery("/roles", async (url) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
		const result: RolesIndexAPI = await response.json();
		return result;
	});
}
