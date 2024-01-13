import { UseMutation, useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
interface CategoriesDestroyAPI {
	success: true;
	message: string;
}
export type CategoriesDestroyApiMutation = UseMutation<
	CategoriesDestroyAPI,
	number,
	{ success: false; message: string }
>;
export function categoriesDestroyApi(): CategoriesDestroyApiMutation {
	return useMutation("/categories", async (url, id: number) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}/${id}`, {
			method: "DELETE",
		});
		const result: CategoriesDestroyAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}
