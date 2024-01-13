import { Injectable } from "@decorators/di";
import { type File } from "formidable";
import {
	validateUpload,
	type ValidationProps,
} from "@vigilio/express-core/helpers";
import { BadRequestException } from "@vigilio/express-core";
import {
	removeFile,
	uploadFiles,
	UploadsEntities,
	UploadsProperties,
} from "../libs";
import { UsersApiService } from "@/users/services/users.api.service";
import { ProductsApiService } from "@/products/services/products.api.service";
import { dimensionsUserFoto } from "@/users/libs";
import { dimensionsProductImages } from "@/products/libs";
import { dimensionsCategoriesFoto } from "@/categories/libs";

@Injectable()
export class UploadsApiService {
	constructor(
		private readonly usersApiService: UsersApiService,
		private readonly productsApiService: ProductsApiService,
	) {}
	async store(props: {
		files: File[];
		name?: string;
		entity: UploadsEntities;
		property: UploadsProperties;
	}) {
		const { entity, files, name, property } = props;
		let qualities: number[] = [];

		switch (entity) {
			case "users":
				if (property === "foto") {
					qualities = await this.customUpload(
						files,
						{
							required: true,
							minFiles: 1,
							maxFiles: 1,
						},
						dimensionsUserFoto(),
					);
				}
				break;
			case "products":
				if (property === "images") {
					qualities = await this.customUpload(
						files,
						{
							required: true,
							minFiles: 1,
							maxFiles: 12,
						},
						dimensionsProductImages(),
					);
				}
				break;
			case "categories":
				if (property === "foto") {
					qualities = await this.customUpload(
						files,
						{
							required: true,
							minFiles: 1,
							maxFiles: 1,
						},
						dimensionsCategoriesFoto(),
					);
				}
				break;
			default:
				throw new BadRequestException(
					"Error server, comunicarse con desarrollador",
				);
		}
		const images = await uploadFiles({ files, entity, name, qualities });
		return {
			success: true,
			images,
		};
	}

	async update(props: {
		files: File[];
		name?: string;
		id: string;
		entity: UploadsEntities;
		property: UploadsProperties;
	}) {
		const { entity, files, name, id, property } = props;
		let entidad;
		switch (entity) {
			case "users": {
				const { user } = await this.usersApiService.show(id);
				if (property === "foto") {
					if (user.foto) {
						removeFile(user.foto, entity);
					}
				}
				entidad = user;
				break;
			}
			case "products": {
				const { product } = await this.productsApiService.show(id);
				if (property === "images") {
					removeFile(product.images, entity);
				}
				entidad = product;
				break;
			}

			default:
				throw new BadRequestException(
					"Error server, comunicarse con desarrollador",
				);
		}
		let filesFoto = null;
		if (files) {
			const { images } = await this.store({
				entity,
				files,
				property,
				name,
			});
			filesFoto = images;
		}
		/*
        type here is so difficult but  i know that you understand me
        */
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		(entidad as any)[property] = filesFoto;
		await entidad!.save();
		return {
			success: true,
			message: "Imagen Editado correctamente",
		};
	}
	async customUpload(
		files: File[],
		validation: ValidationProps,
		qualities: number[],
	) {
		try {
			await validateUpload(files, validation);
			return qualities;
		} catch (error) {
			throw new BadRequestException(error as string);
		}
	}
}
