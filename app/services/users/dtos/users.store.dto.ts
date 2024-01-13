import {
	type Input,
	omitAsync,
	getPipeIssues,
	getOutput,
	mergeAsync,
} from "valibot";
import { Users } from "../entities/users.entity";
import { UsersSchema, usersSchema } from "../schemas/users.schema";
import { Roles } from "@/roles/entities/roles.entity";
import { profilesSchema } from "../schemas/profiles.schema";

export const usersStoreDto = mergeAsync(
	[
		omitAsync(usersSchema, ["id"]),
		omitAsync(profilesSchema, ["id", "user_id"]),
	],
	[
		async (input) => {
			const [byNick, byEmail, bySlug, byRoleId] = await Promise.all([
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
				Users.findOne({
					where: {
						slug: input.slug,
					},
					raw: true,
				}),
				Roles.findByPk(input.role_id),
			]);

			if (byNick) {
				return getPipeIssues(
					"nick" as keyof UsersSchema,
					`Ya existe el usuario con el nick: ${input.nick}`,
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
			if (bySlug) {
				return getPipeIssues(
					"slug" as keyof UsersSchema,
					`Ya existe el usuario con el slug: ${input.slug}`,
					input,
				);
			}
			if (!byRoleId) {
				return getPipeIssues(
					"role_id" as keyof UsersSchema,
					`No existe el rol con el id: ${input.role_id}`,
					input,
				);
			}
			return getOutput(input);
		},
	],
);

export type UsersStoreDto = Input<typeof usersStoreDto>;
