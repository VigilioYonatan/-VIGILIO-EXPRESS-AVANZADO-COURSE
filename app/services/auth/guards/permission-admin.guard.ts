import { UsersSchema } from "@/users/schemas/users.schema";
import { attachMiddleware } from "@decorators/express";
import { NextFunction, Request, Response } from "express";

export function PermissionAdmin() {
	return (
		target: unknown,
		propertyKey: string,
		_descriptor: PropertyDescriptor,
	) => {
		attachMiddleware(
			target,
			propertyKey,
			(req: Request, res: Response, next: NextFunction) => {
				const user = req.user as Omit<UsersSchema, "password">;
				if (req.isAuthenticated() && user?.role_id === 2) {
					return next();
				}
				return res.status(403).json({
					success: false,
					message: "No está permitido realizar acción",
				});
			},
		);
	};
}
