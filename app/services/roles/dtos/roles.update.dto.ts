import { Input, omitAsync } from "valibot";
import { rolesSchema } from "../schemas/roles.schema";

export const rolesUpdateDto = omitAsync(rolesSchema, ["id"]);
export type RolesUpdateDto = Input<typeof rolesUpdateDto>;
