import AdminLayout from "@/admin/components/AdminLayout";
import useAuthStore from "@/auth/stores/auth.store";
import { UsersSchema } from "@/users/schemas/users.schema";
import { Suspense, lazy, useEffect } from "preact/compat";
import { Switch, Router, Route, useLocation } from "wouter-preact";

interface AppProps {
	$user: UsersSchema;
}
function App({ $user }: AppProps) {
	const [location] = useLocation();

	if (!location.startsWith("/")) return null;
	const { methods } = useAuthStore();
	useEffect(() => {
		methods.onInitialAuth($user);
	}, []);

	return (
		<Router base="/admin">
			<AdminLayout>
				<Suspense fallback={null}>
					<Switch>
						<Route
							path="/"
							component={lazy(() => import("@/admin/views/Dashboard"))}
						/>

						<Route
							path="/users"
							component={lazy(() => import("@/users/views/UsersIndex"))}
						/>
						<Route
							path="/users/:id"
							component={lazy(() => import("@/users/views/UsersShow"))}
						/>
						<Route
							path="/users/:id/edit"
							component={lazy(() => import("@/users/views/UsersEdit"))}
						/>
						{/* roles */}
						<Route
							path="/roles"
							component={lazy(() => import("@/roles/views/RolesIndex"))}
						/>
						<Route
							path="/roles/:id"
							component={lazy(() => import("@/roles/views/RolesShow"))}
						/>
						<Route
							path="/roles/:id/edit"
							component={lazy(() => import("@/roles/views/RolesEdit"))}
						/>
						{/* products */}
						<Route
							path="/products"
							component={lazy(() => import("@/products/views/ProductsIndex"))}
						/>
						<Route
							path="/products/:id"
							component={lazy(() => import("@/products/views/ProductsShow"))}
						/>
						<Route
							path="/products/:id/edit"
							component={lazy(() => import("@/products/views/ProductsEdit"))}
						/>
						{/* categories */}
						<Route
							path="/categories"
							component={lazy(
								() => import("@/categories/views/CategoriesIndex"),
							)}
						/>
						<Route
							path="/categories/:id"
							component={lazy(
								() => import("@/categories/views/CategoriesShow"),
							)}
						/>
						{/* categories socket */}
						<Route
							path="/categories-socket"
							component={lazy(
								() => import("@/categories-socket/views/CategoriesSocketIndex"),
							)}
						/>

						<Route component={lazy(() => import("@/admin/views/Page404"))} />
					</Switch>
				</Suspense>
			</AdminLayout>
		</Router>
	);
}

export default App;
