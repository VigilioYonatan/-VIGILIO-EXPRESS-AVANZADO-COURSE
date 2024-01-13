import { slug } from "@vigilio/express-core/helpers";
import {
	minLength,
	Input,
	maxLength,
	email,
	string,
	array,
	nullable,
	object,
	number,
	boolean,
	transform,
} from "valibot";
import { ProfilesSchema } from "./profiles.schema";
import { tvalibot } from "~/hooks/useTranslation";

export const usersSchema = object({
	id: number(),
	nick: string(tvalibot("validation:required"), [
		minLength(1, tvalibot("validation:required")),
		minLength(6, "Este campo require como mínimo 6 carácteres"),
		maxLength(50, "Este campo require como máximo 50 carácteres"),
	]),
	name: string("Este campo es obligatorio", [
		minLength(3, "Este campo require como mínimo 3 carácteres"),
		maxLength(50, "Este campo require como máximo 50 carácteres"),
	]),
	email: string("Este campo es obligatorio", [
		minLength(1, "Este campo es obligatorio"),
		maxLength(100, "Este campo require como máximo 100 carácteres"),
		email(tvalibot("validation:email")),
	]),
	password: string("Este campo es obligatorio", [
		minLength(1, "Este campo es obligatorio"),
		minLength(6, "Este campo como mínimo 6 carácteres"),
		maxLength(100, "Este campo como máximo 100 carácteres"),
	]),
	foto: nullable(array(object({ dimension: number(), file: string() }))),
	enabled: nullable(boolean("Este campo solo permite verdadero o falso")),
	slug: transform(string("Este campo es obligatorio", [minLength(3)]), slug),
	role_id: number("Id no válido"),
});

export type UsersSchema = Input<typeof usersSchema>;
export type UsersEntitySchema = Omit<UsersSchema, "id">;
export type UsersEntitySchemaFormServer = UsersSchema & {
	createdAt: Date;
	updatedAt: Date;
	profile: Omit<ProfilesSchema, "user_id">;
};
