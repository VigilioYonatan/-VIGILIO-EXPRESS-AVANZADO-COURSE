import { UseQuery, useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { RolesIndexMethods, RolesIndexTable } from "@/roles/libs/RolesColumn";
import { RolesSchemaFromServer } from "@/roles/schemas/roles.schema";
interface RolesPaginatorAPI {
	success: true;
	results: RolesSchemaFromServer[];
	count: number;
}
export type RolesPaginatorApi = UseQuery<
	RolesPaginatorAPI,
	RolesPaginatorAPIError
>;

export function rolesPaginatorApi(table: RolesIndexTable): RolesPaginatorApi {
	const result = useQuery<RolesPaginatorAPI, RolesPaginatorAPIError>(
		"/paginator/roles",
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
					methods: { refetch: result.refetch } as RolesIndexMethods,
				});
			},
		},
	);
	return result;
}
export interface RolesPaginatorAPIError {
	success: false;
	message: string;
	params: string;
}
