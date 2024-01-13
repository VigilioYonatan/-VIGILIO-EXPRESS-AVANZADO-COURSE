import { slug } from "@vigilio/express-core/helpers";
import {
	minLength,
	Input,
	array,
	object,
	number,
	string,
	maxLength,
	transform,
} from "valibot";

export const categoriesSchema = object({
	id: number(),
	name: string("Este campo es obligatorio", [
		minLength(1, "Este campo es obligatorio"),
		minLength(3, "Este campo requiere como mínimo 3 carácteres"),
		maxLength(100, "Este campo requiere como mínimo 100 carácteres"),
	]),
	foto: array(object({ dimension: number(), file: string() })),
	slug: transform(string("Este campo es obligatorio", [minLength(3)]), slug),
});

export type CategoriesSchema = Input<typeof categoriesSchema>;
export type CategoriesSchemaFromServer = CategoriesSchema & {
	createdAt: Date;
	updatedAt: Date;
};
