import { Injectable } from "@decorators/di";
import { ProductsApiService } from "@/products/services/products.api.service";

@Injectable()
export class WebService {
	constructor(private readonly productsApiService: ProductsApiService) {}
	async home() {
		const { data: products } = await this.productsApiService.index();

		const showCustomProducts = products.slice(0, 10);

		return { title: "home", showCustomProducts };
	}

	async showProduct(slug: string) {
		const { product } = await this.productsApiService.show(slug);
		return { product };
	}
}
