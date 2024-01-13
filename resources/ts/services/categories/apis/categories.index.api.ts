import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { CategoriesSchemaFromServer } from "../schemas/categories.schema";
interface CategoriesIndexAPI {
	success: true;
	data: CategoriesSchemaFromServer[];
}
export function categoriesIndexApi() {
	return useQuery("/categories", async (url) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
		const result: CategoriesIndexAPI = await response.json();
		return result;
	});
}
