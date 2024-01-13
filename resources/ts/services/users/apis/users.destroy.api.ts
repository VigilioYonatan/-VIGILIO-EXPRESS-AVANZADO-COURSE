import { UseMutation, useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
interface UsersDestroyAPI {
	success: true;
	message: string;
}
export type UsersDestroyApiMutation = UseMutation<
	UsersDestroyAPI,
	number,
	{ success: false; message: string }
>;
export function usersDestroyApi(): UsersDestroyApiMutation {
	return useMutation("/users", async (url, id: number) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}/${id}`, {
			method: "DELETE",
		});
		const result: UsersDestroyAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}
