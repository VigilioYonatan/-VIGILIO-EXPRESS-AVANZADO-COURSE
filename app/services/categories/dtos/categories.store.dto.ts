import { type Input, omitAsync, getPipeIssues, getOutput } from "valibot";
import { Categories } from "../entities/categories.entity";
import { categoriesSchema } from "../schemas/categories.schema";

export const categoriesStoreDto = omitAsync(
	categoriesSchema,
	["id"],
	[
		async (input) => {
			const [byName, bySlug] = await Promise.all([
				Categories.findOne({
					where: {
						name: input.name,
					},
					raw: true,
				}),
				Categories.findOne({
					where: {
						slug: input.slug,
					},
					raw: true,
				}),
			]);

			if (byName) {
				return getPipeIssues(
					"name",
					`Ya existe el categories con el name: ${input.name}`,
					input,
				);
			}
			if (bySlug) {
				return getPipeIssues(
					"slug",
					`Ya existe el categories con el slug: ${input.slug}`,
					input,
				);
			}
			return getOutput(input);
		},
	],
);

export type CategoriesStoreDto = Input<typeof categoriesStoreDto>;
