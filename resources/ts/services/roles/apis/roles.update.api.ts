import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { RolesStoreDto } from "../dtos/roles.store.dto";
import { RolesUpdateDto } from "../dtos/roles.update.dto";
import { RolesSchemaFromServer } from "../schemas/roles.schema";

export function rolesUpdateApi(id: number) {
	return useMutation<RolesUpdateAPI, RolesUpdateDto, RolesUpdateAPIError>(
		`/roles/${id}`,
		async (url, body) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
				method: "PUT",
				body: JSON.stringify({
					...body,
				} as RolesStoreDto),
				headers: {
					"Content-type": "application/json",
				},
			});
			const result: RolesUpdateAPI = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface RolesUpdateAPI {
	success: boolean;
	role: RolesSchemaFromServer;
}

export interface RolesUpdateAPIError {
	success: false;
	message: string;
	body: keyof RolesUpdateDto;
}
