import { AuthApiController } from "@/auth/controllers/auth.api.controller";
import { CategoriesApiController } from "@/categories/controllers/categories.api.controller";
import { PaginatorApiController } from "@/common/paginator/controller/paginator.api.controller";
import { FavoritesApiController } from "@/favorites/controllers/favorites.api.controller";
import { ProductsApiController } from "@/products/controllers/products.api.controller";
import { RolesApiController } from "@/roles/controllers/roles.api.controller";
import { UploadsApiController } from "@/uploads/controllers/uploads.api.controller";
import { UsersApiController } from "@/users/controllers/users.api.controller";
import { Type } from "@decorators/di/lib/src/types";

export const apiRouters: Type[] = [
	RolesApiController,
	UsersApiController,
	ProductsApiController,
	CategoriesApiController,
	FavoritesApiController,
	AuthApiController,
	PaginatorApiController,
	UploadsApiController,
];
