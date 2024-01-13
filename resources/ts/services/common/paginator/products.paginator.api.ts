import { UseQuery, useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { ProductsEntitySchemaFromServer } from "@/products/schemas/products.schema";
import {
	ProductsIndexMethods,
	ProductsIndexTable,
} from "@/products/libs/ProductsColumn";
interface ProductsPaginatorAPI {
	success: true;
	results: ProductsEntitySchemaFromServer[];
	count: number;
}
export type ProductsPaginatorApi = UseQuery<
	ProductsPaginatorAPI,
	ProductsPaginatorAPIError
>;

export function productsPaginatorApi(
	table: ProductsIndexTable,
): ProductsPaginatorApi {
	const result = useQuery<ProductsPaginatorAPI, ProductsPaginatorAPIError>(
		"/paginator/products",
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
					methods: {
						refetch: result.refetch,
					} as ProductsIndexMethods,
				});
			},
		},
	);
	return result;
}
export interface ProductsPaginatorAPIError {
	success: false;
	message: string;
	params: string;
}
