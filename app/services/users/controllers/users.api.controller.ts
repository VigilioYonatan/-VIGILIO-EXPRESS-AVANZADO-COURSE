import { Injectable } from "@decorators/di";
import { UsersApiService } from "../services/users.api.service";
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
import { UsersStoreDto, usersStoreDto } from "../dtos/users.store.dto";
import { UsersUpdateDto, usersUpdateDto } from "../dtos/users.update.dto";
import { objectAsync, string } from "valibot";

@Injectable()
@Controller("/users")
export class UsersApiController {
	constructor(private readonly usersApiService: UsersApiService) {}

	@Get("/")
	async index() {
		const result = await this.usersApiService.index();
		return result;
	}

	@Pipe(
		objectAsync({
			slug: string(),
		}),
	)
	@Get("/:slug")
	async show(@Params("slug") slug: string) {
		const result = await this.usersApiService.show(slug);
		return result;
	}

	@Validator(usersStoreDto)
	@Status(201)
	@Post("/")
	async store(@Body() body: UsersStoreDto) {
		const result = await this.usersApiService.store(body);
		return result;
	}

	@Pipe(
		objectAsync({
			id: string(),
		}),
	)
	@Validator(usersUpdateDto)
	@Status(200)
	@Put("/:id")
	async update(@Params("id") id: string, @Body() body: UsersUpdateDto) {
		const result = await this.usersApiService.update(id, body);
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
		const result = await this.usersApiService.destroy(id);
		return result;
	}
}
