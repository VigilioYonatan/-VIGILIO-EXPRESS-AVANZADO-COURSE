import { UsersSchema } from "@/users/schemas/users.schema";
import { NextFunction, Request, Response } from "express";

export function isAuthenticatedMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	if (req.isAuthenticated()) {
		return res.redirect("/");
	}
	next();
}

export function isAdminOrTrabajadorMiddleware(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	const user = req.user as Omit<UsersSchema, "password">;
	if (req.isAuthenticated() && user && [2, 3].includes(user.role_id)) {
		return next();
	}
	return res.redirect("/auth/login");
}
