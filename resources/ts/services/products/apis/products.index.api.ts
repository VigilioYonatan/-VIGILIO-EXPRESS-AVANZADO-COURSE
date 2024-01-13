import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { ProductsEntitySchemaFromServer } from "../schemas/products.schema";
interface ProductsIndexAPI {
	success: true;
	data: ProductsEntitySchemaFromServer[];
}
export function productsIndexApi() {
	return useQuery("/products", async (url) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
		const result: ProductsIndexAPI = await response.json();
		return result;
	});
}
