import { Injectable } from "@decorators/di";
import { AuthRegisterDto } from "../dtos/auth.register.dto";
import { Users } from "@/users/entities/users.entity";
import { slug } from "@vigilio/express-core/helpers";
import { genSaltSync, hashSync } from "bcryptjs";
import { Profiles } from "@/users/entities/profiles.entity";

@Injectable()
export class AuthApiService {
	async register(authRegisterDto: AuthRegisterDto) {
		const user = new Users(authRegisterDto);
		user.slug = slug(user.nick);
		user.password = hashSync(authRegisterDto.password, genSaltSync(10));
		user.role_id = 1;
		await user.save();
		const profile = new Profiles({
			address: null,
			telephone: null,
			dni: null,
			user_id: user.id,
		});

		await profile.save();
		return {
			success: true,
			user: {
				nick: user.nick,
			},
		};
	}
}
