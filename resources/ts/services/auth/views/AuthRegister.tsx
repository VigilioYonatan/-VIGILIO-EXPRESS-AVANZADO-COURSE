import { useForm } from "react-hook-form";
import Form from "~/components/form";
import { AuthRegisterDto, authRegisterDto } from "../dtos/auth.register.dto";
import { authRegisterApi } from "../apis/auth.register.api";
import { sweetModal } from "@vigilio/sweet";
import enviroments from "~/config";
import { valibotVigilio } from "~/libs/valibot";

function AuthRegister() {
	const authRegisterApiMutation = authRegisterApi();
	const authRegisterForm = useForm<AuthRegisterDto>({
		resolver: valibotVigilio(authRegisterDto),
		mode: "all",
	});
	function onAuthRegisterForm(authRegisterDto: AuthRegisterDto) {
		authRegisterApiMutation.mutate(authRegisterDto, {
			onSuccess(data) {
				sweetModal({
					icon: "success",
					title: "Registrado correctamente",
					text: `Felicidades ${data.user.nick}, te has registrado correctamente`,
					timer: 3,
				});
				authRegisterForm.reset();
			},
			onError(err) {
				if (!err.success && err.body) {
					authRegisterForm.setError(err.body, {
						message: err.message,
					});
					authRegisterForm.resetField(err.body, { keepError: true });
					return;
				}
				sweetModal({
					icon: "danger",
					title: "Error en servidor",
					text: JSON.stringify(err.message),
				});
			},
		});
	}

	return (
		<div class="w-[500px] mx-auto bg-background-light p-4 rounded-md">
			<h1 class="text-primary text-3xl font-bold mb-3">Registrar</h1>
			<Form onSubmit={onAuthRegisterForm} {...authRegisterForm}>
				<Form.control.web
					name={"nick" as keyof AuthRegisterDto}
					title="Nick de usuario"
					placeholder="Tu nick"
					ico={<i class="fas fa-user-circle" />}
				/>
				<Form.control.web
					name={"name" as keyof AuthRegisterDto}
					title="Nombre de usuario"
					placeholder="Tu nombre"
					ico={<i class="fas fa-user" />}
				/>
				<Form.control.web
					name={"email" as keyof AuthRegisterDto}
					title="Correo Electrónico"
					placeholder="example@gmail.com"
					ico={<i class="fas fa-at" />}
					type="email"
				/>
				<Form.control.web
					name={"password" as keyof AuthRegisterDto}
					title="Contraseña"
					placeholder="tu contraseña"
					ico={<i class="fas fa-lock" />}
					type="password"
				/>
				<Form.button.submit
					isLoading={authRegisterApiMutation.isLoading || false}
					title="Registrar"
					className="py-3 px-1"
				/>
			</Form>
			<div class="flex gap-2 mt-8">
				<a
					class="text-primary hover:underline"
					href={`${enviroments.VITE_URL}/auth/login`}
				>
					Ya tengo una cuenta
				</a>
			</div>
		</div>
	);
}

export default AuthRegister;
