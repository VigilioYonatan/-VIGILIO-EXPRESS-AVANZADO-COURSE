import { categoriesShowApi } from "../apis/categories.show.api";
interface CategoriesShowProps {
	params: { id: string };
}
function CategoriesShow(props: CategoriesShowProps) {
	const categoriesShowApiShow = categoriesShowApi(props.params.id);

	let component = null;
	if (categoriesShowApiShow.isLoading) {
		component = <span>Cargando</span>;
	}
	if (categoriesShowApiShow.isError) {
		component = <span>Error</span>;
	}
	if (categoriesShowApiShow.isSuccess) {
		const product = categoriesShowApiShow.data!.category;

		component = <span>{JSON.stringify(product)}</span>;
	}

	return <div class="px-4">{component}</div>;
}

export default CategoriesShow;
