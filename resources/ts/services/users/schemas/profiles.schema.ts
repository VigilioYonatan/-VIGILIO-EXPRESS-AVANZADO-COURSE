import {
	Input,
	maxLength,
	minLength,
	nullable,
	number,
	object,
	string,
} from "valibot";

export const profilesSchema = object({
	id: number(),
	address: nullable(
		string([
			minLength(10, "Este campo permite como mínimo 10 carácteres"),
			maxLength(255, "Este campo permite como máximo 255 carácteres"),
		]),
	),
	telephone: nullable(
		string([
			minLength(9, "Este campo permite como mínimo 9 carácteres"),
			maxLength(9, "Este campo permite como máximo 9 carácteres"),
		]),
	),
	dni: nullable(
		string([
			minLength(8, "Este campo permite como mínimo 8 carácteres"),
			maxLength(8, "Este campo permite como máximo 8 carácteres"),
		]),
	),
	user_id: number("Id no válido"),
});
export type ProfilesSchema = Input<typeof profilesSchema>;
export type ProfilesEntitySchema = Omit<ProfilesSchema, "id">;
