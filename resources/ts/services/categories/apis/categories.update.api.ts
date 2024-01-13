import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { CategoriesStoreDto } from "../dtos/categories.store.dto";
import {
	CategoriesUpdateDto,
	CategoriesUpdateFotoDto,
} from "../dtos/categories.update.dto";
import { CategoriesSchemaFromServer } from "../schemas/categories.schema";

export function categoriesUpdateApi(id: number) {
	return useMutation<
		CategoriesUpdateAPI,
		CategoriesUpdateDto,
		CategoriesUpdateAPIError
	>(`/categories/${id}`, async (url, body) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
			method: "PUT",
			body: JSON.stringify({
				...body,
			} as CategoriesStoreDto),
			headers: {
				"Content-type": "application/json",
			},
		});
		const result: CategoriesUpdateAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}
export function categoriesUpdateFotoApi(id: number) {
	return useMutation<
		CategoriesUpdateAPI,
		CategoriesUpdateFotoDto & { name: string },
		CategoriesUpdateAPIError
	>(`/categories/foto/${id}`, async (url, body) => {
		const formData = new FormData();
		formData.append("name", body.name);
		formData.append("file", body.foto[0]);
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

export interface CategoriesUpdateAPI {
	success: boolean;
	category: CategoriesSchemaFromServer;
}

export interface CategoriesUpdateAPIError {
	success: false;
	message: string;
	body: keyof CategoriesUpdateDto;
}
