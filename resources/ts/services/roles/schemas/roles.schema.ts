import { slug } from "@vigilio/express-core/helpers";
import {
	minLength,
	Input,
	maxLength,
	object,
	number,
	string,
	transform,
} from "valibot";

export const rolesSchema = object({
	id: number(),
	name: string("Este campo es obligatorio", [
		minLength(3, "Este campo require como mínimo 3 carácteres"),
		maxLength(50, "Este campo require como máximo 50 carácteres"),
	]),
	slug: transform(
		string("Este campo es obligatorio", [
			minLength(3, "Este campo require como mínimo 3 carácteres"),
			maxLength(50, "Este campo require como máximo 50 carácteres"),
		]),
		slug,
	),
});

export type RolesSchema = Input<typeof rolesSchema>;
export type RolesSchemaFromServer = RolesSchema & {
	createdAt: Date;
	updatedAt: Date;
};
