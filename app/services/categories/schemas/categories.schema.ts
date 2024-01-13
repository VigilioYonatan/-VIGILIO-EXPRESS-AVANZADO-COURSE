import { slug } from "@vigilio/express-core/helpers";
import {
	numberAsync,
	minLength,
	Input,
	stringAsync,
	objectAsync,
	array,
	object,
	number,
	string,
	maxLength,
	transformAsync,
	custom,
} from "valibot";
import { dimensionsCategoriesFoto } from "../libs";

export const categoriesSchema = objectAsync({
	id: numberAsync(),
	name: stringAsync("Este campo es obligatorio", [
		minLength(1, "Este campo es obligatorio"),
		minLength(3, "Este campo requiere como mínimo 3 carácteres"),
		maxLength(100, "Este campo requiere como mínimo 100 carácteres"),
	]),
	foto: array(
		object({
			dimension: number([
				custom(
					(input) => dimensionsCategoriesFoto().includes(input),
					"Dimension incorrecta",
				),
			]),
			file: string(),
		}),
	),
	slug: transformAsync(
		stringAsync("Este campo es obligatorio", [minLength(3)]),
		slug,
	),
});

export type CategoriesSchema = Input<typeof categoriesSchema>;
export type CategoriesEntitySchema = Omit<CategoriesSchema, "id">;
