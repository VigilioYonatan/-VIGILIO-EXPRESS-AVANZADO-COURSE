import { type Input, omit, merge, object, array, instance } from "valibot";
import { productsSchema } from "../schemas/products.schema";
import { validFileValibot } from "~/libs/valibot";

export const productsStoreDto = merge([
	omit(productsSchema, ["id", "images"]),
	object({
		images: array(instance(File), "Este campo es obligatorio", [
			validFileValibot({
				required: true,
				min: 1,
				max: 12, //maximo 1 archivo
				maxSize: 1, //max 1mb
				types: ["image/jpeg", "image/jpg", "image/webp", "image/png"],
			}),
		]),
	}),
]);

export type ProductsStoreDto = Input<typeof productsStoreDto>;
