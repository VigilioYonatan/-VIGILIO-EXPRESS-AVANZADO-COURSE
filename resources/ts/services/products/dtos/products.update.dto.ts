import { type Input, omit, pick } from "valibot";
import { productsSchema } from "../schemas/products.schema";
import { productsStoreDto } from "./products.store.dto";

export const productsUpdateDto = omit(productsSchema, ["id", "images"]);
export const productsUpdateImagesDto = pick(productsStoreDto, ["images"]);

export type ProductsUpdateDto = Input<typeof productsUpdateDto>;
export type ProductsUpdateImagesDto = Input<typeof productsUpdateImagesDto>;
