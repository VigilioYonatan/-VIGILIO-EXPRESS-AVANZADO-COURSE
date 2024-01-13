import { UseMutation, useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
interface ProductsDestroyAPI {
	success: true;
	message: string;
}
export type ProductsDestroyApiMutation = UseMutation<
	ProductsDestroyAPI,
	number,
	{ success: false; message: string }
>;
export function productsDestroyApi(): ProductsDestroyApiMutation {
	return useMutation("/products", async (url, id: number) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}/${id}`, {
			method: "DELETE",
		});
		const result: ProductsDestroyAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}
