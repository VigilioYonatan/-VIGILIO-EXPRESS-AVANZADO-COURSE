import { type Input, omit } from "valibot";
import { rolesSchema } from "../schemas/roles.schema";

export const rolesStoreDto = omit(rolesSchema, ["id"]);

export type RolesStoreDto = Input<typeof rolesStoreDto>;
