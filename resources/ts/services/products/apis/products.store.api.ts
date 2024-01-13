import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { ProductsStoreDto } from "../dtos/products.store.dto";
import { ProductsEntitySchemaFromServer } from "../schemas/products.schema";

export function productsStoreApi() {
	return useMutation<ProductsStoreAPI, ProductsStoreDto, ProductsStoreAPIError>(
		"/products",
		async (url, body) => {
			const formData = new FormData();
			formData.append("name", body.name);
			for (const image of body.images) {
				formData.append("file", image);
			}
			const responseImage = await fetch(
				`${enviroments.VITE_URL}/api/uploads/products/images`,
				{ method: "POST", body: formData },
			);
			const resultImage = await responseImage.json();
			if (!resultImage.success) throw responseImage;

			const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
				method: "POST",
				body: JSON.stringify({ ...body, images: resultImage.images }),
				headers: {
					"Content-type": "application/json",
				},
			});
			const result: ProductsStoreAPI = await response.json();
			if (!result.success) throw result;
			return result;
		},
	);
}

export interface ProductsStoreAPI {
	success: boolean;
	product: ProductsEntitySchemaFromServer;
}

export interface ProductsStoreAPIError {
	success: false;
	message: string;
	body: keyof ProductsStoreDto;
}
