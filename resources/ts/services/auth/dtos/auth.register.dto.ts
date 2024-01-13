import { usersSchema } from "@/users/schemas/users.schema";
import { Input, pickAsync } from "valibot";

export const authRegisterDto = pickAsync(usersSchema, [
	"nick",
	"name",
	"email",
	"password",
]);
export type AuthRegisterDto = Input<typeof authRegisterDto>;
