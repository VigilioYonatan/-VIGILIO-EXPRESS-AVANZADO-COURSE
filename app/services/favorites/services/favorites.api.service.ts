import { Injectable } from "@decorators/di";
import { Favorites } from "../entities/favorites.entity";
import {
	BadRequestException,
	NotFoundException,
} from "@vigilio/express-core/handler";
import { FavoritesStoreDto } from "../dtos/favorites.store.dto";
import { FavoritesUpdateDto } from "../dtos/favorites.update.dto";
import { Users } from "@/users/entities/users.entity";
import { Products } from "@/products/entities/products.entity";

@Injectable()
export class FavoritesApiService {
	async index() {
		const data = await Favorites.findAll({ raw: true });
		return {
			success: true,
			data,
		};
	}

	async show(slug: string) {
		let favorite = await Favorites.findByPk(slug);
		if (!favorite) {
			favorite = await Favorites.findOne({
				where: {
					slug,
				},
			});
		}
		if (!favorite)
			throw new NotFoundException(`No se encontró un favorito con ${slug}`);
		return {
			success: true,
			favorite,
		};
	}

	async store(favoritesStoreDto: FavoritesStoreDto) {
		const favorite = new Favorites(favoritesStoreDto);
		await favorite.save();

		return {
			success: true,
			favorite,
		};
	}

	async update(id: string, favoritesUpdateDto: FavoritesUpdateDto) {
		const { favorite } = await this.show(id);
		const [byUserId, byProductId] = await Promise.all([
			Users.findByPk(favoritesUpdateDto.user_id),
			Products.findByPk(favoritesUpdateDto.product_id),
		]);
		if (!byUserId) {
			throw new BadRequestException(
				`No se encontró un usuario con el id ${favoritesUpdateDto.user_id}`,
			);
		}
		if (!byProductId) {
			throw new BadRequestException(
				`No se encontró un producto con el id ${favoritesUpdateDto.product_id}`,
			);
		}

		await favorite.update(favoritesUpdateDto);
		return {
			success: true,
			favorite,
		};
	}

	async destroy(id: string) {
		const { favorite } = await this.show(id);
		await favorite.destroy();
		return {
			success: true,
			message: `El favorito con el id ${id} fue eliminado`,
		};
	}
}
