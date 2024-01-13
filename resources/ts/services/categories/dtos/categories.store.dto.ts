import { type Input, omit, merge, object, array, instance } from "valibot";
import { categoriesSchema } from "../schemas/categories.schema";
import { validFileValibot } from "~/libs/valibot";

export const categoriesStoreDto = merge([
	omit(categoriesSchema, ["id", "foto"]),
	object({
		foto: array(instance(File), "Este campo es obligatorio", [
			validFileValibot({
				required: true,
				min: 1,
				max: 1, //maximo 1 archivo
				maxSize: 1, //max 1mb
				types: ["image/jpeg", "image/jpg", "image/webp", "image/png"],
			}),
		]),
	}),
]);

export type CategoriesStoreDto = Input<typeof categoriesStoreDto>;
