import {
	Column,
	DataType,
	Table,
	Model,
	ForeignKey,
} from "sequelize-typescript";
import { FavoritesEntitySchema } from "../schemas/favorites.schema";
import { Users } from "@/users/entities/users.entity";
import { Products } from "@/products/entities/products.entity";

@Table
export class Favorites extends Model implements FavoritesEntitySchema {
	@ForeignKey(() => Users)
	@Column({ type: DataType.NUMBER, allowNull: false })
	user_id: number;

	@ForeignKey(() => Products)
	@Column({ type: DataType.NUMBER, allowNull: false })
	product_id: number;
}
