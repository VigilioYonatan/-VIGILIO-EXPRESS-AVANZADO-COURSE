import { numberAsync, Input, objectAsync } from "valibot";

export const favoritesSchema = objectAsync({
	id: numberAsync(),
	user_id: numberAsync("Id no válido"),
	product_id: numberAsync("Id no válido"),
});

export type FavoritesSchema = Input<typeof favoritesSchema>;
export type FavoritesEntitySchema = Omit<FavoritesSchema, "id">;
