import { slug } from "@vigilio/express-core/helpers";
import {
	numberAsync,
	minLength,
	Input,
	stringAsync,
	objectAsync,
	string,
	number,
	minValue,
	maxValue,
	array,
	object,
	boolean,
	transformAsync,
	custom,
} from "valibot";
import { dimensionsProductImages } from "../libs";

export const productsSchema = objectAsync({
	id: numberAsync(),
	name: stringAsync("Este campo es obligatorio", [minLength(3)]),
	description: string("Este campo es obligatorio", [
		minLength(1, "Este campo es obligatorio"),
	]),
	price: number("Este campo requiere numeros", [minValue(0, "Minimo 0")]),
	discount: number("Este campo requiere numeros", [
		minValue(0, "Minimo 0"),
		maxValue(1, "Maximo 1"),
	]),
	stock: number("Este campo requiere numeros", [minValue(0, "Minimo 0")]),
	images: array(
		object({
			dimension: number([
				custom(
					(input) => dimensionsProductImages().includes(input),
					"Dimension incorrecta",
				),
			]),
			file: string(),
		}),
	),
	enabled: boolean("Este campo solo permite booleanos"),
	slug: transformAsync(
		stringAsync("Este campo es obligatorio", [minLength(3)]),
		slug,
	),
	category_id: numberAsync("Id no válido"),
});

export type ProductsSchema = Input<typeof productsSchema>;
export type ProductsEntitySchema = Omit<ProductsSchema, "id">;
