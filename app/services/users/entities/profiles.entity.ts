import {
	BelongsTo,
	Column,
	DataType,
	ForeignKey,
	Model,
	Table,
} from "sequelize-typescript";
import { ProfilesEntitySchema } from "../schemas/profiles.schema";
import { Users } from "./users.entity";

@Table
export class Profiles extends Model implements ProfilesEntitySchema {
	@Column({ type: DataType.STRING(255) })
	address: string;

	@Column({ type: DataType.STRING(20) })
	telephone: string;

	@Column({ type: DataType.STRING(8) })
	dni: string;

	// one to one : profiles - users
	@ForeignKey(() => Users)
	@Column({ type: DataType.INTEGER })
	user_id: number;

	@BelongsTo(() => Users)
	user: Users;
}
