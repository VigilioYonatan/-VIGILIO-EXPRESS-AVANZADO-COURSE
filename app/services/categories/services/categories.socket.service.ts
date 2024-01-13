import { Injectable } from "@decorators/di";
import { Categories } from "../entities/categories.entity";
import { CategoriesStoreDto } from "../dtos/categories.store.dto";

@Injectable()
export class CategoriesSocketService {
	async index() {
		const categories = await Categories.findAll();
		return categories;
	}

	async store(data: CategoriesStoreDto) {
		const category = new Categories(data);
		await category.save();
		return {
			success: true,
			category,
		};
	}

	async destroy(id: number) {
		const category = await Categories.findByPk(id);

		if (!category) throw `No se encontró una categoría con ${id}`;
		await category.destroy();
		return {
			success: true,
			message: `La categoría con el id ${id} fue eliminado`,
		};
	}
}
