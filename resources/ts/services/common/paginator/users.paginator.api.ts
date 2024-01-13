import { UseQuery, useQuery } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { UsersEntitySchemaFormServer } from "@/users/schemas/users.schema";
import { UsersIndexMethods, UsersIndexTable } from "@/users/libs/UsersColumn";
interface UsersPaginatorAPI {
	success: true;
	results: UsersEntitySchemaFormServer[];
	count: number;
}
export type UsersPaginatorApi = UseQuery<
	UsersPaginatorAPI,
	UsersPaginatorAPIError
>;

export function usersPaginatorApi(table: UsersIndexTable): UsersPaginatorApi {
	const result = useQuery<UsersPaginatorAPI, UsersPaginatorAPIError>(
		"/paginator/users",
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
					methods: { refetch: result.refetch } as UsersIndexMethods,
				});
			},
		},
	);
	return result;
}
export interface UsersPaginatorAPIError {
	success: false;
	message: string;
	params: string;
}
