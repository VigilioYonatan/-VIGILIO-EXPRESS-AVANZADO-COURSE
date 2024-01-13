import { slug } from "@vigilio/express-core/helpers";
import {
	numberAsync,
	minLength,
	Input,
	stringAsync,
	objectAsync,
	maxLength,
	email,
	string,
	array,
	nullable,
	object,
	number,
	boolean,
	transformAsync,
	custom,
} from "valibot";
import { dimensionsUserFoto } from "../libs";
import { tvalibot } from "~/libs/i18next";

export const usersSchema = objectAsync({
	id: numberAsync(),
	nick: stringAsync(tvalibot("validation:required"), [
		minLength(1, "Este campo es obligatorio"),
		minLength(6, "Este campo require como mínimo 6 carácteres"),
		maxLength(50, "Este campo require como máximo 50 carácteres"),
	]),
	name: nullable(
		string("Este campo es obligatorio", [
			minLength(3, "Este campo require como mínimo 3 carácteres"),
			maxLength(50, "Este campo require como máximo 50 carácteres"),
		]),
	),
	email: stringAsync("Este campo es obligatorio", [
		minLength(1, "Este campo es obligatorio"),
		maxLength(100, "Este campo require como máximo 100 carácteres"),
		email("Email no válido"),
	]),
	password: string("Este campo es obligatorio", [
		minLength(1, "Este campo es obligatorio"),
		minLength(6, "Este campo como mínimo 6 carácteres"),
		maxLength(100, "Este campo como máximo 100 carácteres"),
	]),
	foto: nullable(
		array(
			object({
				dimension: number([
					custom(
						(input) => dimensionsUserFoto().includes(input),
						"Dimension incorrecta",
					),
				]),
				file: string(),
			}),
		),
	),
	enabled: nullable(boolean("Este campo solo permite verdadero o falso")),
	slug: transformAsync(
		stringAsync("Este campo es obligatorio", [minLength(3)]),
		slug,
	),
	role_id: numberAsync("Id no válido"),
});

export type UsersSchema = Input<typeof usersSchema>;
export type UsersEntitySchema = Omit<UsersSchema, "id">;
