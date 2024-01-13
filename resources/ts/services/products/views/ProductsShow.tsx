import { productsShowApi } from "../apis/products.show.api";
interface ProductsShowProps {
	params: { id: string };
}
function ProductsShow(props: ProductsShowProps) {
	const productsShowApiShow = productsShowApi(props.params.id);

	let component = null;
	if (productsShowApiShow.isLoading) {
		component = <span>Cargando</span>;
	}
	if (productsShowApiShow.isError) {
		component = <span>Error</span>;
	}
	if (productsShowApiShow.isSuccess) {
		const product = productsShowApiShow.data!.product;

		component = <span>{JSON.stringify(product)}</span>;
	}

	return <div class="px-4">{component}</div>;
}

export default ProductsShow;
