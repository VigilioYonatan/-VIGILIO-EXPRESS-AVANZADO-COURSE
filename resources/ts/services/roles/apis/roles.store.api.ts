import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { RolesStoreDto } from "../dtos/roles.store.dto";
import { RolesSchemaFromServer } from "../schemas/roles.schema";

export function rolesStoreApi() {
	return useMutation<RolesStoreAPI, RolesStoreDto, RolesStoreAPIError>(
		"/roles",
		async (url, body) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
				method: "POST",
				body: JSON.stringify(body),
				headers: {
					"Content-type": "application/json",
				},
			});
			const result: RolesStoreAPI = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface RolesStoreAPI {
	success: boolean;
	role: RolesSchemaFromServer;
}

export interface RolesStoreAPIError {
	success: false;
	message: string;
	body: keyof RolesStoreDto;
}
