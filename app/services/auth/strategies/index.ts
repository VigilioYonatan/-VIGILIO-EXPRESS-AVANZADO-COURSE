import { Users } from "@/users/entities/users.entity";
import { compareSync } from "bcryptjs";
import { Strategy as LocalStrategy } from "passport-local";
// local
export function localStrategy() {
	return new LocalStrategy(
		{ usernameField: "email" },
		async (email, password, done) => {
			const user = await Users.findOne({
				where: {
					email,
				},
			});
			if (!user) {
				return done(null, false, {
					message: "Correo o contraseña no válido",
				});
			}
			const validPassword = compareSync(password, user.password);
			if (!validPassword) {
				return done(null, false, {
					message: "Correo o contraseña no válido",
				});
			}

			return done(null, {
				id: user.id,
				nick: user.nick,
				role_id: user.role_id,
			});
		},
	);
}

// google
