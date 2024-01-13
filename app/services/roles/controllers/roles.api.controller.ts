import { Injectable } from "@decorators/di";
import { RolesApiService } from "../services/roles.api.service";
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
import { RolesStoreDto, rolesStoreDto } from "../dtos/roles.store.dto";
import { RolesUpdateDto, rolesUpdateDto } from "../dtos/roles.update.dto";
import { objectAsync, string } from "valibot";

@Injectable()
@Controller("/roles")
export class RolesApiController {
	constructor(private readonly rolesApiService: RolesApiService) {}

	@Get("/")
	async index() {
		const result = await this.rolesApiService.index();
		return result;
	}

	@Pipe(
		objectAsync({
			slug: string(),
		}),
	)
	@Get("/:slug")
	async show(@Params("slug") slug: string) {
		const result = await this.rolesApiService.show(slug);
		return result;
	}

	@Validator(rolesStoreDto)
	@Status(201)
	@Post("/")
	async store(@Body() body: RolesStoreDto) {
		const result = await this.rolesApiService.store(body);
		return result;
	}

	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Validator(rolesUpdateDto)
	@Status(200)
	@Put("/:id")
	async update(@Params("id") id: string, @Body() body: RolesUpdateDto) {
		const result = await this.rolesApiService.update(id, body);
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
		const result = await this.rolesApiService.destroy(id);
		return result;
	}
}
