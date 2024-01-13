import { Injectable } from "@decorators/di";
import { Products } from "../entities/products.entity";
import {
	BadRequestException,
	NotFoundException,
} from "@vigilio/express-core/handler";
import { ProductsStoreDto } from "../dtos/products.store.dto";
import { ProductsUpdateDto } from "../dtos/products.update.dto";
import { Op } from "sequelize";
import { Categories } from "@/categories/entities/categories.entity";
import { removeFile } from "@/uploads/libs";
import cache from "@vigilio/express-core/cache";
import { productCacheName } from "../libs";

@Injectable()
export class ProductsApiService {
	async index() {
		let data: string | null | Products[] = JSON.parse(
			cache.get(productCacheName()) || "null",
		);

		if (!data) {
			data = await Products.findAll({ order: [["createdAt", "ASC"]] });
			cache.set(productCacheName(), JSON.stringify(data));
		}

		return {
			success: true,
			data,
		};
	}

	async show(slug: string) {
		let product = JSON.parse(
			cache.get(`${productCacheName()}/${slug}`) || "null",
		);
		if (!product) {
			if (!Number.isNaN(Number(slug))) {
				product = await Products.findByPk(slug);
			} else {
				product = await Products.findOne({
					where: {
						slug,
					},
				});
			}
			if (!product)
				throw new NotFoundException(`No se encontró un producto  con ${slug}`);
		}

		cache.set(`${productCacheName()}/${product.id}`, JSON.stringify(product));
		cache.set(`${productCacheName()}/${product.slug}`, JSON.stringify(product));

		return {
			success: true,
			product,
		};
	}

	async store(productsStoreDto: ProductsStoreDto) {
		const product = new Products(productsStoreDto);
		await product.save();
		cache.delete(productCacheName());
		return {
			success: true,
			product,
		};
	}

	async update(id: string, productsUpdateDto: ProductsUpdateDto) {
		const product = await Products.findByPk(id);
		if (!product)
			throw new NotFoundException(`No se encontró un producto con ${id}`);

		const [existByName, existBySlug, existByCategoryId] = await Promise.all([
			Products.findOne({
				where: {
					name: productsUpdateDto.name,
					id: { [Op.not]: id },
				},
				raw: true,
			}),
			Products.findOne({
				where: {
					slug: productsUpdateDto.slug,
					id: { [Op.not]: id },
				},
				raw: true,
			}),
			Categories.findByPk(productsUpdateDto.category_id, {
				raw: true,
			}),
		]);
		if (existByName) {
			throw new BadRequestException(
				`Este producto con el nombre ${productsUpdateDto.name} ya existe`,
				{ body: "name" as keyof ProductsUpdateDto },
			);
		}
		if (existBySlug) {
			throw new BadRequestException(
				`Este producto con el slug ${productsUpdateDto.slug} ya existe`,
				{ body: "slug" as keyof ProductsUpdateDto },
			);
		}
		if (!existByCategoryId) {
			throw new BadRequestException(
				`No se encontró categoria con el id: ${productsUpdateDto.category_id}`,
				{ body: "category_id" as keyof ProductsUpdateDto },
			);
		}
		cache.delete(`${productCacheName()}/${product.id}`);
		cache.delete(`${productCacheName()}/${product.slug}`);
		cache.delete(productCacheName());
		await product.update(productsUpdateDto);

		return {
			success: true,
			product,
		};
	}

	async destroy(id: string) {
		const product = await Products.findByPk(id);
		if (!product)
			throw new NotFoundException(`No se encontró un producto con ${id}`);
		removeFile(product.images, "products");
		cache.delete(`${productCacheName()}/${product.id}`);
		cache.delete(`${productCacheName()}/${product.slug}`);
		cache.delete(productCacheName());
		await product.destroy();

		return {
			success: true,
			message: `El producto con el id ${id} fue eliminado`,
		};
	}
}
