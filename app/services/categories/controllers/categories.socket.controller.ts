import { Injectable } from "@decorators/di";
import {
	Controller,
	IO,
	Event,
	Args,
	Socket,
	Connect,
} from "@decorators/socket";
import socket from "socket.io";
import {
	CategoriesStoreDto,
	categoriesStoreDto,
} from "../dtos/categories.store.dto";
import { SocketValidator } from "@vigilio/express-core/valibot";
import { CategoriesSocketService } from "../services/categories.socket.service";

@Injectable()
@Controller("/")
export class CategoriesSocketController {
	constructor(
		private readonly categoriesSocketService: CategoriesSocketService,
	) {}
	@Connect()
	async index(@IO() io: socket.Socket) {
		const result = await this.categoriesSocketService.index();
		io.emit("categories-index", result);
	}

	@Event("categories-store", [SocketValidator(categoriesStoreDto)])
	async store(
		@Args() data: CategoriesStoreDto,
		@Socket() socket: socket.Socket,
		@IO() io: socket.Socket,
	) {
		const result = await this.categoriesSocketService.store(data);
		socket.emit("categories-store:success", result);
		const resultIndex = await this.categoriesSocketService.index();
		io.emit("categories-index", resultIndex);
	}

	@Event("categories-destroy")
	async destroy(
		@Args() id: number,
		@Socket() socket: socket.Socket,
		@IO() io: socket.Socket,
	) {
		try {
			const result = await this.categoriesSocketService.destroy(id);
			socket.emit("categories-destroy:success", result);
			const resultIndex = await this.categoriesSocketService.index();
			io.emit("categories-index", resultIndex);
		} catch (error) {
			socket.emit("categories-destroy:errors", {
				success: false,
				message: (error as Error).message,
			});
		}
	}
}
