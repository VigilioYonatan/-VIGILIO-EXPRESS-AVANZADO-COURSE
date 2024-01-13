import { Injectable } from "@decorators/di";
import { Users } from "../entities/users.entity";
import {
	BadRequestException,
	NotFoundException,
} from "@vigilio/express-core/handler";
import { UsersStoreDto } from "../dtos/users.store.dto";
import { UsersUpdateDto } from "../dtos/users.update.dto";
import { Op } from "sequelize";
import { hashSync, genSaltSync } from "bcryptjs";
import { Profiles } from "../entities/profiles.entity";
import { removeFile } from "@/uploads/libs";

@Injectable()
export class UsersApiService {
	async index() {
		const data = await Users.findAll();
		return {
			success: true,
			data,
		};
	}

	async show(slug: string) {
		let user = await Users.findByPk(slug);
		if (!user) {
			user = await Users.findOne({
				where: {
					slug,
				},
			});
		}
		if (!user)
			throw new NotFoundException(`No se encontró un usuario con ${slug}`);
		return {
			success: true,
			user,
		};
	}

	async store(usersStoreDto: UsersStoreDto) {
		const { address, telephone, dni, ...rest } = usersStoreDto;
		const user = new Users(rest);
		// hash password
		const salt = genSaltSync(10);
		user.password = hashSync(user.password, salt);
		await user.save();
		const profile = new Profiles({
			address,
			telephone,
			dni,
			user_id: user.id,
		});

		await profile.save();

		return {
			success: true,
			user: { ...user.toJSON(), ...profile.toJSON() },
		};
	}

	async update(id: string, usersUpdateDto: UsersUpdateDto) {
		const { user } = await this.show(id);
		const { telephone, address, dni, ...rest } = usersUpdateDto;
		const [existByNick, existByEmail, existBySlug] = await Promise.all([
			Users.findOne({
				where: {
					nick: rest.nick,
					id: { [Op.not]: id },
				},
				raw: true,
			}),
			Users.findOne({
				where: {
					email: rest.name,
					id: { [Op.not]: id },
				},
				raw: true,
			}),
			Users.findOne({
				where: {
					slug: rest.name,
					id: { [Op.not]: id },
				},
				raw: true,
			}),
		]);
		if (existByNick) {
			throw new BadRequestException(
				`Este usuario con el nick ${rest.nick} ya existe`,
				{ body: "nick" as keyof UsersUpdateDto },
			);
		}
		if (existByEmail) {
			throw new BadRequestException(
				`Este usuario con el email ${rest.email} ya existe`,
				{ body: "email" as keyof UsersUpdateDto },
			);
		}
		if (existBySlug) {
			throw new BadRequestException(
				`Este usuario con el slug ${rest.slug} ya existe`,
				{ body: "slug" as keyof UsersUpdateDto },
			);
		}

		await user.update(rest);
		await user.set("profile", {
			address,
			telephone,
			dni,
		});
		return {
			success: true,
			user,
		};
	}

	async destroy(id: string) {
		const { user } = await this.show(id);
		if (user.foto) {
			removeFile(user.foto, "users");
		}
		await user.destroy();
		return {
			success: true,
			message: `El usuario con el id ${id} fue eliminado`,
		};
	}
}
