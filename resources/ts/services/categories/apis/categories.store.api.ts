import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { CategoriesStoreDto } from "../dtos/categories.store.dto";
import { CategoriesSchemaFromServer } from "../schemas/categories.schema";

export function categoriesStoreApi() {
	return useMutation<
		CategoriesStoreAPI,
		CategoriesStoreDto,
		CategoriesStoreAPIError
	>("/categories", async (url, body) => {
		const formData = new FormData();
		formData.append("name", body.name);
		formData.append("file", body.foto[0]);
		const responseImage = await fetch(
			`${enviroments.VITE_URL}/api/uploads/categories/foto`,
			{ method: "POST", body: formData },
		);
		const resultImage = await responseImage.json();
		if (!resultImage.success) throw responseImage;

		const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
			method: "POST",
			body: JSON.stringify({ ...body, foto: resultImage.images }),
			headers: {
				"Content-type": "application/json",
			},
		});
		const result: CategoriesStoreAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}

export interface CategoriesStoreAPI {
	success: boolean;
	category: CategoriesSchemaFromServer;
}

export interface CategoriesStoreAPIError {
	success: false;
	message: string;
	body: keyof CategoriesStoreDto;
}
