import { Controller, Get, Next, Req, Res } from "@decorators/express";
import { NextFunction, Request, Response } from "express";
import { isAuthenticatedMiddleware } from "../middlewares";
@Controller("/")
export class AuthController {
    @Get("/register", [isAuthenticatedMiddleware])
    register(@Res() res: Response) {
        return res.render("auth/register", { title: "Registrar" });
    }

    @Get("/login", [isAuthenticatedMiddleware])
    login(@Res() res: Response) {
        return res.render("auth/login", { title: "Iniciar sesión" });
    }

    @Get("/logout")
    logout(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction
    ) {
        req.logout((err) => {
            if (err) {
                return next(err);
            }
            res.redirect("/");
        });
    }
}
