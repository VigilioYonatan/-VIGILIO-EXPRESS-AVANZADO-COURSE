import { Input, number, object, string } from "valibot";
import enviroments from "~/config";
export const uploadsSchema = object({ dimension: number(), file: string() });
export type UploadsSchema = Input<typeof uploadsSchema>;
export function printFileDimension(
	files: UploadsSchema[],
	entity: string,
	dimension: number,
) {
	const findByDimension = files.find((file) => file.dimension === dimension);
	return `${enviroments.VITE_URL}/images/${entity}/${findByDimension?.file}`;
}
export async function getFilesEdit(
	files: UploadsSchema[],
	entity: string,
	dimension: number,
) {
	const filterImages = files.filter((pro) => pro.dimension === dimension);
	const response = await Promise.all(
		filterImages.map((file) => {
			return fetch(`${enviroments.VITE_URL}/images/${entity}/${file.file}`);
		}),
	);
	const result = await Promise.all(response.map((req) => req.blob()));
	const images = result.map(
		(res, i) =>
			new File([res], filterImages[i].file, {
				type: "image/webp",
			}),
	);
	return images;
}
