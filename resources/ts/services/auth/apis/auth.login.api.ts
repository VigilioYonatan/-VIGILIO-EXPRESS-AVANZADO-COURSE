import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { AuthLoginDto } from "../dtos/auth.login.dto";
import { UsersSchema } from "@/users/schemas/users.schema";

export function authLoginApi() {
	return useMutation<
		{
			success: true;
			user: Pick<UsersSchema, "id" | "nick" | "role_id">;
		},
		AuthLoginDto,
		{ success: false; message: string }
	>("/auth/login", async (url, authLoginDto) => {
		// http://localhost:4000/api/auth/Login
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
			method: "POST",
			body: JSON.stringify(authLoginDto),
			headers: {
				"Content-type": "application/json",
			},
		});
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}
