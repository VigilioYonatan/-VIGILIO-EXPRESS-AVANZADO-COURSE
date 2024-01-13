import { Injectable } from "@decorators/di";
import { Body, Controller, Post } from "@decorators/express";
import { AuthApiService } from "../services/auth.api.service";
import { Validator } from "@vigilio/express-core/valibot";
import { AuthRegisterDto, authRegisterDto } from "../dtos/auth.register.dto";
import passport from "passport";
import { NextFunction, Request, Response } from "express";
import { UsersSchema } from "@/users/schemas/users.schema";

@Injectable()
@Controller("/auth")
export class AuthApiController {
	constructor(private readonly authApiService: AuthApiService) {}

	@Validator(authRegisterDto)
	@Post("/register")
	async register(@Body() body: AuthRegisterDto) {
		const result = await this.authApiService.register(body);
		return result;
	}

	@Post("/login", [
		(req: Request, res: Response, next: NextFunction) => {
			passport.authenticate(
				"local",
				(
					err: Error,
					user: Pick<UsersSchema, "id" | "nick" | "role_id">,
					message: { message: string },
				) => {
					if (err) {
						return next(err);
					}
					if (!user) {
						return res.status(401).json({ success: false, ...message });
					}

					req.logIn(user, (err) => {
						if (err) {
							return next(err);
						}
						return res.status(201).json({
							success: true,
							user: {
								id: user.id,
								nick: user.nick,
								role_id: user.role_id,
							},
						});
					});
				},
			)(req, res, next);
		},
	])
	async login() {}
}
