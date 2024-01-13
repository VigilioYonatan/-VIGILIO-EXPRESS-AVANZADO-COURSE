import { Input, omitAsync } from "valibot";
import { favoritesSchema } from "../schemas/favorites.schema";

export const favoritesUpdateDto = omitAsync(favoritesSchema, ["id"]);
export type FavoritesUpdateDto = Input<typeof favoritesUpdateDto>;
