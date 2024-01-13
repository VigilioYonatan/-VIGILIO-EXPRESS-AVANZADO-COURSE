import { type Input, omit, pick } from "valibot";
import { categoriesSchema } from "../schemas/categories.schema";
import { categoriesStoreDto } from "./categories.store.dto";

export const categoriesUpdateDto = omit(categoriesSchema, ["id", "foto"]);
export const categoriesUpdateFotoDto = pick(categoriesStoreDto, ["foto"]);

export type CategoriesUpdateDto = Input<typeof categoriesUpdateDto>;
export type CategoriesUpdateFotoDto = Input<typeof categoriesUpdateFotoDto>;
