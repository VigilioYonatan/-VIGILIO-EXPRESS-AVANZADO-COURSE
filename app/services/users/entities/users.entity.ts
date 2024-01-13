import {
	Column,
	DataType,
	Table,
	Model,
	ForeignKey,
	BelongsTo,
	HasOne,
	BelongsToMany,
	DefaultScope,
} from "sequelize-typescript";
import { UsersEntitySchema } from "../schemas/users.schema";
import { Roles } from "@/roles/entities/roles.entity";
import { Profiles } from "./profiles.entity";
import { Products } from "@/products/entities/products.entity";
import { Favorites } from "@/favorites/entities/favorites.entity";

@DefaultScope(() => ({
	include: {
		model: Profiles,
		attributes: { exclude: ["createdAt", "updatedAt", "user_id"] },
	},
}))
@Table
export class Users extends Model implements UsersEntitySchema {
	@Column({
		allowNull: false,
		unique: true,
		type: DataType.STRING(50),
	})
	nick: string;
	@Column({
		type: DataType.STRING(50),
	})
	name: string | null;

	@Column({
		allowNull: false,
		unique: true,
		type: DataType.STRING(100),
	})
	email: string;

	@Column({
		allowNull: false,
		type: DataType.STRING(100),
	})
	password: string;

	@Column({ type: DataType.JSON })
	foto: { dimension: number; file: string }[] | null;

	@Column({ type: DataType.BOOLEAN, defaultValue: false })
	enabled: boolean | null;

	@Column({
		allowNull: false,
		unique: true,
		type: DataType.STRING(100),
	})
	slug: string;

	// one to many: users-roles
	@ForeignKey(() => Roles)
	@Column({ allowNull: false })
	role_id: number;

	@BelongsTo(() => Roles)
	role: Roles;

	// one to one : users - profiles
	@HasOne(() => Profiles)
	profile: Profiles;

	// many to many : users - favorites
	@BelongsToMany(
		() => Products,
		() => Favorites,
	)
	products: Products[];
}
