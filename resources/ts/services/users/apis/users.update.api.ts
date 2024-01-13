import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { UsersStoreDto } from "../dtos/users.store.dto";
import { UsersUpdateDto, UsersUpdateFotoDto } from "../dtos/users.update.dto";
import { UsersEntitySchemaFormServer } from "../schemas/users.schema";

export function usersUpdateApi(id: number) {
	return useMutation<UsersUpdateAPI, UsersUpdateDto, UsersUpdateAPIError>(
		`/users/${id}`,
		async (url, body) => {
			const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
				method: "PUT",
				body: JSON.stringify({
					...body,
				} as UsersStoreDto),
				headers: {
					"Content-type": "application/json",
				},
			});
			const result: UsersUpdateAPI = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export function usersUpdateFotoApi(id: number) {
	return useMutation<
		UsersUpdateAPI,
		UsersUpdateFotoDto & { nick: string },
		UsersUpdateAPIError
	>(`/users/foto/${id}`, async (url, body) => {
		const formData = new FormData();
		if (body.foto) {
			formData.append("file", body.foto[0]);
			formData.append("name", body.nick);
		}
		const responseImage = await fetch(
			`${enviroments.VITE_URL}/api/uploads${url}`,
			{
				method: "PATCH",
				body: formData,
			},
		);
		const resultImage = await responseImage.json();
		if (!resultImage.success) throw responseImage;
		return resultImage;
	});
}

export interface UsersUpdateAPI {
	success: boolean;
	user: UsersEntitySchemaFormServer;
}

export interface UsersUpdateAPIError {
	success: false;
	message: string;
	body: keyof UsersUpdateDto;
}
