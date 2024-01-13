import { CategoriesSchema } from "@/categories/schemas/categories.schema";
import { slug } from "@vigilio/express-core/helpers";

import {
	minLength,
	Input,
	object,
	number,
	string,
	transform,
	minValue,
	maxValue,
	array,
	boolean,
} from "valibot";
import { tvalibot } from "~/hooks/useTranslation";

export const productsSchema = object({
	id: number(),
	name: string(tvalibot("validation:required"), [minLength(3)]),
	description: string("Este campo es obligatorio", [
		minLength(1, "Este campo es obligatorio"),
	]),
	price: number("Este campo requiere numeros", [minValue(0, "Minimo 0")]),
	discount: number("Este campo requiere numeros", [
		minValue(0, "Minimo 0"),
		maxValue(1, "Maximo 1"),
	]),
	stock: number("Este campo requiere numeros", [minValue(0, "Minimo 0")]),
	images: array(object({ dimension: number(), file: string() })),
	enabled: boolean("Este campo solo permite booleanos"),
	slug: transform(string("Este campo es obligatorio", [minLength(3)]), slug),
	category_id: number("Id no válido"),
});

export type ProductsSchema = Input<typeof productsSchema>;
export type ProductsEntitySchemaFromServer = ProductsSchema & {
	createdAt: Date;
	updatedAt: Date;
	category: CategoriesSchema;
};
