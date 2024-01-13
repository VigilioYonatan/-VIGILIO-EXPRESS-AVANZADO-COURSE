import express, { NextFunction, Request, Response } from "express";
import path from "path";
import session from "express-session";
import passport from "passport";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import enviroments from "~/config/enviroments.config";
import memoryStore from "memorystore";
import { ERROR_MIDDLEWARE, attachControllers } from "@decorators/express";
import { connectDB } from "~/config/db.config";
import { ServerErrorMiddleware } from "@vigilio/express-core/handler";
import { Container } from "@decorators/di";
import { logger } from "@vigilio/express-core/helpers";
import { client } from "@vigilio/express-core/client";
import { apiRouters } from "~/routers/api.router";
import { webRouters } from "~/routers/web.router";
import { authRouters } from "~/routers/auth.router";
import { middlewareRoute } from "~/libs/middleware-route";
import { holiday } from "~/libs/helpers";
import { Users } from "@/users/entities/users.entity";
import { adminRouters } from "~/routers/admin.router";
import { UsersSchema } from "@/users/schemas/users.schema";
import { localStrategy } from "@/auth/strategies";
import { cacheMiddleware } from "@vigilio/express-core/cache";
import {
    IO_MIDDLEWARE,
    attachControllers as attachSocketsControllers,
} from "@decorators/socket";
import socket from "socket.io";
import http from "node:http";
import { GlobalMiddleware } from "~/libs/socket";
import { socketRouters } from "~/routers/socket.router";
import i18nextHttpMiddleware from "i18next-http-middleware";
import i18next from "../libs/i18next";

export class Server {
    public readonly app: express.Application = express();

    constructor() {
        this.middlewares();
        this.auth();
        this.routes();
    }
    middlewares() {
        // vite js configuración
        this.app.use(client());
        // comprimir paginas webs para mejor rendimiento - NO TOCAR si no es necesario
        this.app.use(
            compression({
                threshold: 10000,
                filter: (req, res) => {
                    if (req.headers["x-no-compression"]) {
                        return false;
                    }
                    return compression.filter(req, res);
                },
            })
        );
        // ver cachés
        this.app.use(cacheMiddleware());
        // habilitar cookies
        this.app.use(cookieParser());

        // habilitar para consumir json
        this.app.use(express.json());
        // habilitar carpeta public
        this.app.use(
            express.static(path.resolve(__dirname, "..", "..", "public"))
        );
        // habilitar para consumir vistas
        this.app.set("view engine", "ejs");
        this.app.set(
            "views",
            path.resolve(__dirname, "..", "..", "resources", "views")
        );
        //locales
        this.app.use(i18nextHttpMiddleware.handle(i18next));

        // metodos globales
        this.app.use(async (_req, res, next) => {
            res.locals.holiday = holiday;
            next();
        });

        connectDB();
    }

    async auth() {
        this.app.set("trust proxy", 1);
        // cachear session para mejor rendimiento de las sessiones
        const memoryStoreClass = memoryStore(session);
        // https://www.passportjs.org/concepts/authentication/sessions/
        const closeSession = 24 * 60 * 60 * 1000 * 15; // 15 dias
        this.app.use(
            session({
                secret: enviroments.SECRET_SESSION_KEY,
                resave: false,
                saveUninitialized: false,
                cookie: {
                    secure: enviroments.NODE_ENV === "production", //true in production
                    httpOnly: true,
                    maxAge: closeSession, // 15 dia
                },
                store: new memoryStoreClass({
                    checkPeriod: closeSession,
                }),
            })
        );
        // initialize session
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        //  strategies
        passport.use(localStrategy());

        passport.serializeUser((user, done) => {
            return done(null, user);
        });
        passport.deserializeUser(
            async (
                user: Pick<UsersSchema, "id" | "nick" | "role_id">,
                done
            ) => {
                const findUser = await Users.findByPk(user.id, {
                    attributes: { exclude: ["password"] },
                });
                if (!findUser) return done({ message: "error authenticated" });
                // console.log({ user });
                return done(null, findUser);
            }
        );
        this.app.use(
            async (req: Request, res: Response, next: NextFunction) => {
                res.locals.$user = req.user;
                next();
            }
        );
    }

    routes() {
        this.app.use(morgan("dev"));
        const apiRouter = express.Router();
        const webRouter = express.Router();
        const adminRouter = express.Router();
        const authRouter = express.Router();
        attachControllers(apiRouter, apiRouters);
        attachControllers(webRouter, webRouters);
        attachControllers(adminRouter, adminRouters);
        attachControllers(authRouter, authRouters);
        Container.provide([
            { provide: ERROR_MIDDLEWARE, useClass: ServerErrorMiddleware },
        ]);
        this.app.use("/", webRouter);
        this.app.use("/auth", authRouter);
        this.app.use("/admin", adminRouter);
        this.app.use("/api", apiRouter);
        this.app.use(middlewareRoute);
    }

    listen() {
        const server = new http.Server(this.app);
        const io = new socket.Server(server);
        attachSocketsControllers(io, socketRouters);
        Container.provide([
            { provide: IO_MIDDLEWARE, useClass: GlobalMiddleware },
        ]);
        server.listen(enviroments.PORT, () => {
            logger.primary(`Run server in port ${enviroments.PORT}`);
        });
        return server;
    }
}
