import { Input, mergeAsync, omitAsync } from "valibot";
import { usersSchema } from "../schemas/users.schema";
import { profilesSchema } from "../schemas/profiles.schema";

export const usersUpdateDto = mergeAsync([
	omitAsync(usersSchema, ["id", "foto", "password"]),
	omitAsync(profilesSchema, ["id", "user_id"]),
]);
export type UsersUpdateDto = Input<typeof usersUpdateDto>;
