import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { ProductsEntitySchemaFromServer } from "../schemas/products.schema";
interface ProductsShowAPI {
	success: true;
	product: ProductsEntitySchemaFromServer;
}
export function productsShowApi(id: string) {
	return useQuery(`/products/${id}`, async (url) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
		const result: ProductsShowAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}
