import { UploadsSchema, printFileDimension } from "~/libs/upload";
type DimensionProduct = 300 | 500;
export function getDimensionProductsImages(dimension: 300 | 500) {
    return dimension;
}
export function printProductsImages(
    files: UploadsSchema[],
    dimension: DimensionProduct
) {
    const images = printFileDimension(files, "products", dimension);
    return { images, dimension };
}
