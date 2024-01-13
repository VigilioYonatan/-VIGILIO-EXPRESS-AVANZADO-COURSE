import { Injectable } from "@decorators/di";
import { ProductsApiService } from "../services/products.api.service";
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
// biome-ignore lint/nursery/noUnusedImports: <explanation>
import { ProductsStoreDto, productsStoreDto } from "../dtos/products.store.dto";
import {
	ProductsUpdateDto,
	// biome-ignore lint/nursery/noUnusedImports: <explanation>
	productsUpdateDto,
} from "../dtos/products.update.dto";
import { objectAsync, string } from "valibot";
import { PermissionAdmin } from "@/auth/guards/permission-admin.guard";

@Injectable()
@Controller("/products")
export class ProductsApiController {
	constructor(private readonly productsApiService: ProductsApiService) {}

	@Get("/")
	async index() {
		const result = await this.productsApiService.index();
		return result;
	}

	@Pipe(
		objectAsync({
			slug: string(),
		}),
	)
	@Get("/:slug")
	async show(@Params("slug") slug: string) {
		const result = await this.productsApiService.show(slug);
		return result;
	}

	@PermissionAdmin()
	@Validator(productsStoreDto)
	@Status(201)
	@Post("/")
	async store(@Body() productsStoreDto: ProductsStoreDto) {
		const result = await this.productsApiService.store(productsStoreDto);
		return result;
	}

	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Validator(productsUpdateDto)
	@Status(200)
	@Put("/:id")
	async update(
		@Params("id") id: string,
		@Body() productsUpdateDto: ProductsUpdateDto,
	) {
		const result = await this.productsApiService.update(id, productsUpdateDto);
		return result;
	}

	@PermissionAdmin()
	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Status(201)
	@Delete("/:id")
	async destroy(@Params("id") id: string) {
		const result = await this.productsApiService.destroy(id);
		return result;
	}
}
