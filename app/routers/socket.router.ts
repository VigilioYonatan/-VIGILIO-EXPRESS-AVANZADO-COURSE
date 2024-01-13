import { CategoriesSocketController } from "@/categories/controllers/categories.socket.controller";
import { Type } from "@decorators/di/lib/src/types";

export const socketRouters: Type[] = [CategoriesSocketController];
