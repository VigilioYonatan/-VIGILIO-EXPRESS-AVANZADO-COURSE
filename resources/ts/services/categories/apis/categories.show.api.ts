import { useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { CategoriesSchemaFromServer } from "../schemas/categories.schema";
interface CategoriesShowAPI {
	success: true;
	category: CategoriesSchemaFromServer;
}
export function categoriesShowApi(id: string) {
	return useQuery(`/categories/${id}`, async (url) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`);
		const result: CategoriesShowAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}
