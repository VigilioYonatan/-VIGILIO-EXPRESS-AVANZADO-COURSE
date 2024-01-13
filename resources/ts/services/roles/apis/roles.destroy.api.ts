import { UseMutation, useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
interface RolesDestroyAPI {
	success: true;
	message: string;
}
export type RolesDestroyApiMutation = UseMutation<
	RolesDestroyAPI,
	number,
	{ success: false; message: string }
>;
export function rolesDestroyApi(): RolesDestroyApiMutation {
	return useMutation("/roles", async (url, id: number) => {
		const response = await fetch(`${enviroments.VITE_URL}/api${url}/${id}`, {
			method: "DELETE",
		});
		const result: RolesDestroyAPI = await response.json();
		if (!result.success) throw result;
		return result;
	});
}
