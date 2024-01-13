import {
	type Input,
	merge,
	omit,
	object,
	instance,
	nullable,
	array,
} from "valibot";
import { usersSchema } from "../schemas/users.schema";
import { profilesSchema } from "../schemas/profiles.schema";
import { validFileValibot } from "~/libs/valibot";

export const usersStoreDto = merge([
	omit(usersSchema, ["id", "foto"]),
	omit(profilesSchema, ["id", "user_id"]),
	object({
		foto: nullable(
			array(instance(File), [
				validFileValibot({
					required: false,
					min: 0,
					max: 1, //maximo 1 archivo
					maxSize: 1, //max 1mb
					types: ["image/jpeg", "image/jpg", "image/webp"],
				}),
			]),
		),
	}),
]);

export type UsersStoreDto = Input<typeof usersStoreDto>;
