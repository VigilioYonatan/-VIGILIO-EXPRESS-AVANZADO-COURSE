import { slug } from "@vigilio/express-core/helpers";
import {
	numberAsync,
	minLength,
	Input,
	stringAsync,
	objectAsync,
	maxLength,
	transformAsync,
} from "valibot";

export const rolesSchema = objectAsync({
	id: numberAsync(),
	name: stringAsync("Este campo es obligatorio", [
		minLength(3, "Este campo require como mínimo 3 carácteres"),
		maxLength(50, "Este campo require como máximo 50 carácteres"),
	]),
	slug: transformAsync(
		stringAsync("Este campo es obligatorio", [
			minLength(3, "Este campo require como mínimo 3 carácteres"),
			maxLength(50, "Este campo require como máximo 50 carácteres"),
		]),
		slug,
	),
});

export type RolesSchema = Input<typeof rolesSchema>;
export type RolesEntitySchema = Omit<RolesSchema, "id">;
