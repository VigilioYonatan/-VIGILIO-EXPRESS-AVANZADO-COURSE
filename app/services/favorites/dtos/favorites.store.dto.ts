import { type Input, omitAsync, getOutput, getPipeIssues } from "valibot";
import {
	favoritesSchema,
	type FavoritesSchema,
} from "../schemas/favorites.schema";
import { Users } from "@/users/entities/users.entity";
import { Products } from "@/products/entities/products.entity";
import { Favorites } from "../entities/favorites.entity";

export const favoritesStoreDto = omitAsync(
	favoritesSchema,
	["id"],
	[
		async (input) => {
			const [byUserId, byProductId, byProductUserId] = await Promise.all([
				Users.findByPk(input.user_id),
				Products.findByPk(input.product_id),
				Favorites.findOne({
					where: {
						product_id: input.product_id,
						user_id: input.user_id,
					},
				}),
			]);
			if (!byUserId) {
				return getPipeIssues(
					"user_id" as keyof FavoritesSchema,
					`No se encontró un usuario con el id ${input.user_id}`,
					input,
				);
			}
			if (!byProductId) {
				return getPipeIssues(
					"product_id" as keyof FavoritesSchema,
					`No se encontró un producto con el id ${input.product_id}`,
					input,
				);
			}
			if (byProductUserId) {
				return getPipeIssues(
					"product_id" as keyof FavoritesSchema,
					`Ya añadiste este producto ${input.product_id} al usuario ${input.user_id}`,
					input,
				);
			}

			return getOutput(input);
		},
	],
);

export type FavoritesStoreDto = Input<typeof favoritesStoreDto>;
