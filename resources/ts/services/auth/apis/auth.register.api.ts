import { useMutation } from "@vigilio/preact-fetching";
import enviroments from "~/config";
import { AuthRegisterDto } from "../dtos/auth.register.dto";

export function authRegisterApi() {
	return useMutation<
		{
			success: true;
			user: { nick: string };
		},
		AuthRegisterDto,
		{ success: false; message: string; body: keyof AuthRegisterDto }
	>("/auth/register", async (url, authRegisterDto) => {
		// http://localhost:4000/api/auth/register
		const response = await fetch(`${enviroments.VITE_URL}/api${url}`, {
			method: "POST",
			body: JSON.stringify(authRegisterDto),
			headers: {
				"Content-type": "application/json",
			},
		});
		const result = await response.json();
		if (!result.success) throw result;
		return result;
	});
}
