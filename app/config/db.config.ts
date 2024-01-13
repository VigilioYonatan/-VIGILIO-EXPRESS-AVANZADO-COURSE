import { Sequelize } from "sequelize-typescript";
import enviroments from "./enviroments.config";
import { logger } from "@vigilio/express-core/helpers";
import { Roles } from "@/roles/entities/roles.entity";
import { Users } from "@/users/entities/users.entity";
import { Profiles } from "@/users/entities/profiles.entity";
import { Products } from "@/products/entities/products.entity";
import { Categories } from "@/categories/entities/categories.entity";
import { Favorites } from "@/favorites/entities/favorites.entity";
const sequelize = new Sequelize({
    dialect: "postgres",
    host: enviroments.DB_HOST,
    username: enviroments.DB_USER,
    password: enviroments.DB_PASS,
    database: enviroments.DB_NAME,
    port: enviroments.DB_PORT,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});

sequelize.addModels([
    Roles,
    Users,
    Profiles,
    Products,
    Categories,
    Favorites,
    // here entities
]);

export async function connectDB() {
    try {
        await sequelize.authenticate();
        logger.success("conectado a base de datos correctamente");
        if (enviroments.NODE_ENV === "production") return;
        // await sequelize.sync({ alter: true });
    } catch (error) {
        logger.error(`Error al conectar base de datos: ${error}`);
    }
}
export { sequelize };
