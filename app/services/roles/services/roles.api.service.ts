import { Injectable } from "@decorators/di";
import { Roles } from "../entities/roles.entity";
import {
	BadRequestException,
	NotFoundException,
} from "@vigilio/express-core/handler";
import { RolesStoreDto } from "../dtos/roles.store.dto";
import { RolesUpdateDto } from "../dtos/roles.update.dto";
import { Op } from "sequelize";

@Injectable()
export class RolesApiService {
	async index() {
		const data = await Roles.findAll();
		return {
			success: true,
			data,
		};
	}

	async show(slug: string) {
		let role = await Roles.findByPk(slug);
		if (!role) {
			role = await Roles.findOne({
				where: {
					slug,
				},
			});
		}
		if (!role) throw new NotFoundException(`No se encontró un rol con ${slug}`);
		return {
			success: true,
			role,
		};
	}

	async store(rolesStoreDto: RolesStoreDto) {
		const role = new Roles(rolesStoreDto);
		await role.save();

		return {
			success: true,
			role,
		};
	}

	async update(id: string, rolesUpdateDto: RolesUpdateDto) {
		const { role } = await this.show(id);
		const [existByName, existBySlug] = await Promise.all([
			Roles.findOne({
				where: {
					name: rolesUpdateDto.name,
					id: { [Op.not]: id },
				},
				raw: true,
			}),
			Roles.findOne({
				where: {
					slug: rolesUpdateDto.name,
					id: { [Op.not]: id },
				},
				raw: true,
			}),
		]);
		if (existByName) {
			throw new BadRequestException(
				`Este role con el nombre ${rolesUpdateDto.name} ya existe`,
				{ body: "name" as keyof RolesUpdateDto },
			);
		}
		if (existBySlug) {
			throw new BadRequestException(
				`Este role con el slug ${rolesUpdateDto.slug} ya existe`,
				{ body: "slug" as keyof RolesUpdateDto },
			);
		}
		await role.update(rolesUpdateDto);
		return {
			success: true,
			role,
		};
	}

	async destroy(id: string) {
		const { role } = await this.show(id);
		await role.destroy();
		return {
			success: true,
			message: `El rol con el id ${id} fue eliminado`,
		};
	}
}
