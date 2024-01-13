import { type Input, omitAsync, getPipeIssues, getOutput } from "valibot";
import { Products } from "../entities/products.entity";
import { ProductsSchema, productsSchema } from "../schemas/products.schema";
import { Categories } from "@/categories/entities/categories.entity";

export const productsStoreDto = omitAsync(
	productsSchema,
	["id"],
	[
		async (input) => {
			const [byName, bySlug, byCategoryID] = await Promise.all([
				Products.findOne({
					where: {
						name: input.name,
					},
					raw: true,
				}),
				Products.findOne({
					where: {
						slug: input.slug,
					},
					raw: true,
				}),
				Categories.findByPk(input.category_id, { raw: true }),
			]);

			if (byName) {
				return getPipeIssues(
					"name" as keyof ProductsSchema,
					`Ya existe el products con el name: ${input.name}`,
					input,
				);
			}
			if (bySlug) {
				return getPipeIssues(
					"slug" as keyof ProductsSchema,
					`Ya existe el products con el slug: ${input.slug}`,
					input,
				);
			}
			if (!byCategoryID) {
				return getPipeIssues(
					"category_id" as keyof ProductsSchema,
					`No se encontró categoria con el id: ${input.category_id}`,
					input,
				);
			}
			return getOutput(input);
		},
	],
);
export type ProductsStoreDto = Input<typeof productsStoreDto>;
