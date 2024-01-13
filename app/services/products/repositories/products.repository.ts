import { Injectable } from "@decorators/di";
import { Products } from "../entities/products.entity";

@Injectable()
export class ProductsRepository {
	showCustom(limit = 3) {
		return Products.findAll({ limit });
	}
}
