import { type Input, omit } from "valibot";
import { rolesSchema } from "../schemas/roles.schema";

export const rolesUpdateDto = omit(rolesSchema, ["id"]);

export type RolesUpdateDto = Input<typeof rolesUpdateDto>;
