import { isAdminOrTrabajadorMiddleware } from "@/auth/middlewares";
import { Controller, Get, Res } from "@decorators/express";
import { Response } from "express";
@Controller("/*", [isAdminOrTrabajadorMiddleware])
export class AdminController {
	@Get("/")
	dashboard(@Res() res: Response) {
		return res.render("admin", { title: "Admin" });
	}
}
