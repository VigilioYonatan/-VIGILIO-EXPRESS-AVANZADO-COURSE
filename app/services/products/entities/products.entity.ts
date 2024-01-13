import {
	Column,
	DataType,
	Table,
	Model,
	BelongsTo,
	ForeignKey,
	BelongsToMany,
	DefaultScope,
} from "sequelize-typescript";
import { ProductsEntitySchema } from "../schemas/products.schema";
import { Categories } from "@/categories/entities/categories.entity";
import { Users } from "@/users/entities/users.entity";
import { Favorites } from "@/favorites/entities/favorites.entity";

@DefaultScope(() => ({
	include: {
		model: Categories,
		attributes: { exclude: ["createdAt", "updatedAt"] },
	},
}))
@Table
export class Products extends Model implements ProductsEntitySchema {
	@Column({
		allowNull: false,
		unique: true,
		type: DataType.STRING(255),
	})
	name: string;

	@Column({ allowNull: false, type: DataType.TEXT })
	description: string;

	@Column({
		allowNull: false,
		type: DataType.DECIMAL(10, 2),
		defaultValue: 0,
	})
	price: number;

	@Column({
		allowNull: false,
		type: DataType.DECIMAL(10, 2),
		defaultValue: 0,
	})
	discount: number;

	@Column({
		allowNull: false,
		type: DataType.INTEGER,
	})
	stock: number;

	@Column({ allowNull: false, type: DataType.JSON })
	images: { dimension: number; file: string }[];

	@Column({ allowNull: false, type: DataType.BOOLEAN })
	enabled: boolean;

	@Column({
		allowNull: false,
		unique: true,
		type: DataType.STRING(255),
	})
	slug: string;

	// one to many : products - categories
	@ForeignKey(() => Categories)
	@Column({ type: DataType.INTEGER, allowNull: false })
	category_id: number;

	@BelongsTo(() => Categories)
	category: Categories;

	// many to many : users - favorites
	@BelongsToMany(
		() => Users,
		() => Favorites,
	)
	users: Users[];
}
