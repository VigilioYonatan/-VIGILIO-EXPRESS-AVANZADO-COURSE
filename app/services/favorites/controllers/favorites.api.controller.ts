import { Injectable } from "@decorators/di";
import { FavoritesApiService } from "../services/favorites.api.service";
import {
	Body,
	Controller,
	Delete,
	Get,
	Params,
	Post,
	Put,
	Status,
} from "@decorators/express";
import { Pipe, Validator } from "@vigilio/express-core/valibot";

import { objectAsync, string } from "valibot";
import {
	// biome-ignore lint/nursery/noUnusedImports: <explanation>
	favoritesUpdateDto,
	FavoritesUpdateDto,
} from "../dtos/favorites.update.dto";
import {
	FavoritesStoreDto,
	// biome-ignore lint/nursery/noUnusedImports: <explanation>
	favoritesStoreDto,
} from "../dtos/favorites.store.dto";

@Injectable()
@Controller("/favorites")
export class FavoritesApiController {
	constructor(private readonly favoritesApiService: FavoritesApiService) {}

	@Get("/")
	async index() {
		const result = await this.favoritesApiService.index();
		return result;
	}

	@Pipe(
		objectAsync({
			slug: string(),
		}),
	)
	@Get("/:slug")
	async show(@Params("slug") slug: string) {
		const result = await this.favoritesApiService.show(slug);
		return result;
	}

	@Validator(favoritesStoreDto)
	@Status(201)
	@Post("/")
	async store(@Body() favoritesStoreDto: FavoritesStoreDto) {
		const result = await this.favoritesApiService.store(favoritesStoreDto);
		return result;
	}

	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Validator(favoritesUpdateDto)
	@Status(200)
	@Put("/:id")
	async update(
		@Params("id") id: string,
		@Body() favoritesUpdateDto: FavoritesUpdateDto,
	) {
		const result = await this.favoritesApiService.update(
			id,
			favoritesUpdateDto,
		);
		return result;
	}

	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Status(201)
	@Delete("/:id")
	async destroy(@Params("id") id: string) {
		const result = await this.favoritesApiService.destroy(id);
		return result;
	}
}
