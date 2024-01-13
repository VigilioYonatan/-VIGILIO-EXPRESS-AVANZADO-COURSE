import { Column, DataType, Table, Model, HasMany } from "sequelize-typescript";
import { RolesEntitySchema } from "../schemas/roles.schema";
import { Users } from "@/users/entities/users.entity";

@Table
export class Roles extends Model implements RolesEntitySchema {
	@Column({
		allowNull: false,
		unique: true,
		type: DataType.STRING(50),
	})
	name: string;

	@Column({
		allowNull: false,
		unique: true,
		type: DataType.STRING(50),
	})
	slug: string;

	// one to many: roles-users
	@HasMany(() => Users)
	users: Users[];
}
