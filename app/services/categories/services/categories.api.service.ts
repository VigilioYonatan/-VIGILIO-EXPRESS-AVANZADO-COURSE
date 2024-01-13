import { Injectable } from "@decorators/di";
import { Categories } from "../entities/categories.entity";
import {
	BadRequestException,
	NotFoundException,
} from "@vigilio/express-core/handler";
import { CategoriesStoreDto } from "../dtos/categories.store.dto";
import { CategoriesUpdateDto } from "../dtos/categories.update.dto";
import { Op } from "sequelize";

@Injectable()
export class CategoriesApiService {
	async index() {
		const data = await Categories.findAll({ raw: true });
		return {
			success: true,
			data,
		};
	}

	async show(slug: string) {
		let category = await Categories.findByPk(slug);
		if (!category) {
			category = await Categories.findOne({
				where: {
					slug,
				},
			});
		}
		if (!category)
			throw new NotFoundException(`No se encontró una categoría con ${slug}`);
		return {
			success: true,
			category,
		};
	}

	async store(categoriesStoreDto: CategoriesStoreDto) {
		const category = new Categories(categoriesStoreDto);
		await category.save();

		return {
			success: true,
			category,
		};
	}

	async update(id: string, categoriesUpdateDto: CategoriesUpdateDto) {
		const { category } = await this.show(id);
		const [existByName, existBySlug] = await Promise.all([
			Categories.findOne({
				where: {
					name: categoriesUpdateDto.name,
					id: { [Op.not]: id },
				},
				raw: true,
			}),
			Categories.findOne({
				where: {
					slug: categoriesUpdateDto.slug,
					id: { [Op.not]: id },
				},
				raw: true,
			}),
		]);
		if (existByName) {
			throw new BadRequestException(
				`Esta categoría con el nombre ${categoriesUpdateDto.name} ya existe`,
			);
		}
		if (existBySlug) {
			throw new BadRequestException(
				`Esta categoría con el slug ${categoriesUpdateDto.slug} ya existe`,
			);
		}
		await category.update(categoriesUpdateDto);
		return {
			success: true,
			category,
		};
	}

	async destroy(id: string) {
		const { category } = await this.show(id);
		await category.destroy();
		return {
			success: true,
			message: `La categoría con el id ${id} fue eliminado`,
		};
	}
}
