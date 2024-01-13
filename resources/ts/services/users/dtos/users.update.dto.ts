import { Input, mergeAsync, omitAsync, pick } from "valibot";
import { usersSchema } from "../schemas/users.schema";
import { profilesSchema } from "../schemas/profiles.schema";
import { usersStoreDto } from "./users.store.dto";

export const usersUpdateDto = mergeAsync([
	omitAsync(usersSchema, ["id", "foto", "password"]),
	omitAsync(profilesSchema, ["id", "user_id"]),
]);

export const usersUpdateFotoDto = pick(usersStoreDto, ["foto"]);

export type UsersUpdateDto = Input<typeof usersUpdateDto>;
export type UsersUpdateFotoDto = Input<typeof usersUpdateFotoDto>;
