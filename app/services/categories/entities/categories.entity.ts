import { Column, DataType, Table, Model, HasMany } from "sequelize-typescript";
import { CategoriesEntitySchema } from "../schemas/categories.schema";
import { Products } from "@/products/entities/products.entity";

@Table
export class Categories extends Model implements CategoriesEntitySchema {
	@Column({
		allowNull: false,
		unique: true,
		type: DataType.STRING(100),
	})
	name: string;

	@Column({ type: DataType.JSON, allowNull: false })
	foto: { dimension: number; file: string }[];

	@Column({
		allowNull: false,
		unique: true,
		type: DataType.STRING,
	})
	slug: string;

	// one to many - categories - products
	@HasMany(() => Products)
	products: Products[];
}
