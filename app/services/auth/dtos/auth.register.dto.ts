import { Users } from "@/users/entities/users.entity";
import { UsersSchema, usersSchema } from "@/users/schemas/users.schema";
import { Input, getOutput, getPipeIssues, pickAsync } from "valibot";
import { tvalibot } from "~/libs/i18next";

export const authRegisterDto = pickAsync(
	usersSchema,
	["nick", "name", "email", "password"],
	[
		async (input) => {
			const [byNick, byEmail] = await Promise.all([
				Users.findOne({
					where: {
						nick: input.nick,
					},
					raw: true,
				}),
				Users.findOne({
					where: {
						email: input.email,
					},
					raw: true,
				}),
			]);
			if (byNick) {
				return getPipeIssues(
					"nick" as keyof UsersSchema,
					tvalibot("validation:unique", {
						value: input.nick,
					}),
					input,
				);
			}
			if (byEmail) {
				return getPipeIssues(
					"email" as keyof UsersSchema,
					`Ya existe el usuario con el email: ${input.email}`,
					input,
				);
			}

			return getOutput(input);
		},
	],
);
export type AuthRegisterDto = Input<typeof authRegisterDto>;
