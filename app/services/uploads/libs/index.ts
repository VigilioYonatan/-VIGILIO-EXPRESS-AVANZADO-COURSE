import { File } from "formidable";
import { slug } from "@vigilio/express-core";
import sharp, { type OutputInfo, type Sharp } from "sharp";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import enviroments from "~/config/enviroments.config";
import { ImagesSchema } from "../schemas/uploads.schema";

export type UploadsEntities = "users" | "products" | "categories";

export const uploadsEntities: UploadsEntities[] = [
	"users",
	"products",
	"categories",
];
export type UploadsProperties = "foto" | "images";
export const uploadsProperties: UploadsProperties[] = ["foto", "images"];

interface uploadFilesProps {
	files: File[];
	name?: string;
	entity: UploadsEntities;
	qualities: number[];
}
export async function uploadFiles({
	files,
	entity,
	name,
	qualities,
}: uploadFilesProps) {
	let filesNames: { file: string; dimension: number }[] = [];
	for (const file of files) {
		const dir = `${pathUploads()}/${entity}`;
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
			// biome-ignore lint/suspicious/noConsoleLog: <explanation>
			console.log("Creado directorio correctamente");
		}
		let sharpFiles: Sharp | Promise<OutputInfo>[] = [];
		for (const quality of qualities) {
			const fileName = `${name ? slug(name) : crypto.randomUUID()}${Date.now()
				.toString(32)
				.substring(4)}x${quality}.webp`;
			filesNames = [
				...filesNames,
				{
					file: fileName,
					dimension: quality,
				},
			];
			sharpFiles = [
				...sharpFiles,
				sharp(file.filepath)
					.resize(quality)
					.webp({ quality: 80 })
					.toFile(path.resolve(dir, fileName)),
			];
		}
		await Promise.all(sharpFiles);
	}
	return filesNames;
}
export function pathUploads() {
	return path.resolve(__dirname, "..", "..", "..", "..", "public", "images");
}
export function pathPublicImage() {
	return `${enviroments.VITE_URL}/images`;
}
export function removeFile(images: ImagesSchema[], entity: UploadsEntities) {
	for (const img of images) {
		const image = `${pathUploads()}/${entity}/${img.file}`;

		if (fs.existsSync(image)) {
			fs.unlinkSync(image);
		}
	}
}
