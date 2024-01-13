import { type Input, omitAsync, getPipeIssues, getOutput } from "valibot";
import { Roles } from "../entities/roles.entity";
import { rolesSchema } from "../schemas/roles.schema";

export const rolesStoreDto = omitAsync(
	rolesSchema,
	["id"],
	[
		async (input) => {
			const [byName, bySlug] = await Promise.all([
				Roles.findOne({
					where: {
						name: input.name,
					},
					raw: true,
				}),
				Roles.findOne({
					where: {
						slug: input.slug,
					},
					raw: true,
				}),
			]);

			if (byName) {
				return getPipeIssues(
					"name",
					`Ya existe el roles con el name: ${input.name}`,
					input,
				);
			}
			if (bySlug) {
				return getPipeIssues(
					"slug",
					`Ya existe el roles con el slug: ${input.slug}`,
					input,
				);
			}
			return getOutput(input);
		},
	],
);
export type RolesStoreDto = Input<typeof rolesStoreDto>;
