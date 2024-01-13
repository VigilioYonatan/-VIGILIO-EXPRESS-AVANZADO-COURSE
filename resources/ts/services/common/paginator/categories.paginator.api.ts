import { UseQuery, useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { CategoriesSchemaFromServer } from "@/categories/schemas/categories.schema";
import {
	CategoriesIndexMethods,
	CategoriesIndexTable,
} from "@/categories/libs/CategoriesColumn";
interface CategoriesPaginatorAPI {
	success: true;
	results: CategoriesSchemaFromServer[];
	count: number;
}
export type CategoriesPaginatorApi = UseQuery<
	CategoriesPaginatorAPI,
	CategoriesPaginatorAPIError
>;

export function categoriesPaginatorApi(
	table: CategoriesIndexTable,
): CategoriesPaginatorApi {
	const result = useQuery<CategoriesPaginatorAPI, CategoriesPaginatorAPIError>(
		"/paginator/categories",
		async (url) => {
			const data = new URLSearchParams();
			data.append("offset", String(table.pagination.value.offset));
			data.append("limit", String(table.pagination.value.limit));
			data.append("search", String(table.search.value));
			for (const [key, value] of Object.entries(table.sort.value)) {
				data.append(key, value);
			}
			const response = await fetch(`${enviroments.VITE_URL}/api${url}?${data}`);
			const result = await response.json();
			if (!result.success) throw result;
			return result;
		},
		{
			onSuccess(data) {
				table.updateData({
					count: data.count,
					result: data.results,
					methods: { refetch: result.refetch } as CategoriesIndexMethods,
				});
			},
		},
	);
	return result;
}
export interface CategoriesPaginatorAPIError {
	success: false;
	message: string;
	params: string;
}
