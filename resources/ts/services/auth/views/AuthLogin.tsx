import { useForm } from "react-hook-form";
import Form from "~/components/form";
import { AuthLoginDto, authLoginDto } from "../dtos/auth.login.dto";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { authLoginApi } from "../apis/auth.login.api";
import { sweetModal } from "@vigilio/sweet";
import enviroments from "~/config";

function AuthLogin() {
    const authLoginMutation = authLoginApi();
    const authLoginForm = useForm<AuthLoginDto>({
        resolver: valibotResolver(authLoginDto),
        mode: "all",
    });
    function onAuthLoginForm(authLoginDto: AuthLoginDto) {
        authLoginMutation.mutate(authLoginDto, {
            onSuccess(data) {
                sweetModal({
                    icon: "success",
                    title: "Logueado correctamente",
                    text: `Felicidades inciaste sesión correctamente: ${data.user.nick}`,
                    timer: 5,
                }).then(() => {
                    if (data.user.role_id === 2) {
                        window.location.href = `${enviroments.VITE_URL}/admin`;
                        return;
                    }
                    window.location.href = `${enviroments.VITE_URL}/`;
                });
                authLoginForm.reset();
            },
        });
    }
    return (
        <div class="w-[500px] mx-auto bg-background-light p-4 rounded-md">
            <h1 class="text-primary text-3xl font-bold mb-3">Login</h1>
            <Form onSubmit={onAuthLoginForm} {...authLoginForm}>
                <>
                    {authLoginMutation.error ? (
                        <p class="text-red-600 py-2 px-1">
                            {authLoginMutation.error.message}
                        </p>
                    ) : null}
                </>
                <Form.control.web
                    name={"email" as keyof AuthLoginDto}
                    title="Correo Electrónico"
                    placeholder="example@gmail.com"
                    ico={<i class="fas fa-at" />}
                />
                <Form.control.web
                    name={"password" as keyof AuthLoginDto}
                    title="Contraseña"
                    placeholder="tu contraseña"
                    ico={<i class="fas fa-lock" />}
                    type="password"
                />
                <Form.button.submit
                    isLoading={authLoginMutation.isLoading || false}
                    title="Iniciar sesión"
                    className="py-3 px-1"
                />
            </Form>
            <div class="flex gap-2 mt-8">
                <a
                    class="text-primary hover:underline"
                    href={`${enviroments.VITE_URL}/auth/register`}
                >
                    Registrase
                </a>
            </div>
        </div>
    );
}

export default AuthLogin;
