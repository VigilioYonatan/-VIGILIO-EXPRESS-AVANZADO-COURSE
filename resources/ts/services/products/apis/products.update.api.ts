import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { ProductsStoreDto } from "../dtos/products.store.dto";
import {
	ProductsUpdateDto,
	ProductsUpdateImagesDto,
} from "../dtos/products.update.dto";
import { ProductsEntitySchemaFromServer } from "../schemas/products.schema";

export function productsUpdateApi(id: number) {
	return useMutation<
		ProductsUpdateAPI,
		ProductsUpdateDto,
		ProductsUpdateAPIError
	>(`/products/${id}`, async (url, body) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
			method: "PUT",
			body: JSON.stringify({
				...body,
			} as ProductsStoreDto),
			headers: {
				"Content-type": "application/json",
			},
		});
		const result: ProductsUpdateAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}
export function productsUpdateImagesApi(id: number) {
	return useMutation<
		ProductsUpdateAPI,
		ProductsUpdateImagesDto & { name: string },
		ProductsUpdateAPIError
	>(`/products/images/${id}`, async (url, body) => {
		const formData = new FormData();
		formData.append("name", body.name);
		for (const image of body.images) {
			formData.append("file", image);
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

export interface ProductsUpdateAPI {
	success: boolean;
	product: ProductsEntitySchemaFromServer;
}

export interface ProductsUpdateAPIError {
	success: false;
	message: string;
	body: keyof ProductsUpdateDto;
}
