import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { UsersStoreDto } from "../dtos/users.store.dto";
import { UsersEntitySchemaFormServer } from "../schemas/users.schema";

export function usersStoreApi() {
	return useMutation<UsersStoreAPI, UsersStoreDto, UsersStoreAPIError>(
		"/users",
		async (url, body) => {
			const formData = new FormData();

			let images = null;
			if (body.foto) {
				formData.append("file", body.foto[0]);
				formData.append("name", body.nick);
				const responseImage = await fetch(
					`${enviroments.VITE_URL}/api/uploads/users/foto`,
					{ method: "POST", body: formData },
				);
				const resultImage = await responseImage.json();
				if (!resultImage.success) throw responseImage;
				images = resultImage.images;
			}

			const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
				method: "POST",
				body: JSON.stringify({
					...body,
					foto: images,
				} as UsersStoreDto),
				headers: {
					"Content-type": "application/json",
				},
			});
			const result: UsersStoreAPI = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface UsersStoreAPI {
	success: boolean;
	user: UsersEntitySchemaFormServer;
}

export interface UsersStoreAPIError {
	success: false;
	message: string;
	body: keyof UsersStoreDto;
}
