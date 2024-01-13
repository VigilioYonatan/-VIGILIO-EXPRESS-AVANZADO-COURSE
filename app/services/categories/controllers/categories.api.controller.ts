import { Injectable } from "@decorators/di";
import { CategoriesApiService } from "../services/categories.api.service";
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
import {
	CategoriesStoreDto,
	categoriesStoreDto,
} from "../dtos/categories.store.dto";
import {
	CategoriesUpdateDto,
	categoriesUpdateDto,
} from "../dtos/categories.update.dto";
import { objectAsync, string } from "valibot";

@Injectable()
@Controller("/categories")
export class CategoriesApiController {
	constructor(private readonly categoriesApiService: CategoriesApiService) {}

	@Get("/")
	async index() {
		const result = await this.categoriesApiService.index();
		return result;
	}

	@Pipe(
		objectAsync({
			slug: string(),
		}),
	)
	@Get("/:slug")
	async show(@Params("slug") slug: string) {
		const result = await this.categoriesApiService.show(slug);
		return result;
	}

	@Validator(categoriesStoreDto)
	@Status(201)
	@Post("/")
	async store(@Body() body: CategoriesStoreDto) {
		const result = await this.categoriesApiService.store(body);
		return result;
	}

	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Validator(categoriesUpdateDto)
	@Status(200)
	@Put("/:id")
	async update(@Params("id") id: string, @Body() body: CategoriesUpdateDto) {
		const result = await this.categoriesApiService.update(id, body);
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
		const result = await this.categoriesApiService.destroy(id);
		return result;
	}
}
