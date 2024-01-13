import { usersSchema } from "@/users/schemas/users.schema";
import { Input, pickAsync } from "valibot";

export const authLoginDto = pickAsync(usersSchema, ["email", "password"]);
export type AuthLoginDto = Input<typeof authLoginDto>;
