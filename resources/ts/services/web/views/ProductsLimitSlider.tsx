import { ProductsEntitySchemaFromServer } from "@/products/schemas/products.schema";
import Slider, { Settings } from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { printProductsImages } from "@/products/libs/helpers";

interface ProductsLimitSliderProps {
	products: ProductsEntitySchemaFromServer[];
}
function ProductsLimitSlider(props: ProductsLimitSliderProps) {
	const settings: Settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		arrows: true,
		className: "w-full products-limit-slide",
	};
	return (
		<>
			<Slider {...settings}>
				{props.products.map((product) => {
					const { dimension, images } = printProductsImages(
						product.images,
						300,
					);
					return (
						<div>
							<img
								src={images}
								width={dimension}
								height={dimension}
								alt={product.name}
							/>
							<div>
								<span>{product.id}</span>
								<h3 class="line-clamp-3">
									Lorem ipsum dolor sit amet consectetur adipisicing elit.
									Magnam deserunt doloremque quam consequuntur ab qui
									reprehenderit, perspiciatis odit molestias dolorem iste
									voluptate, neque aspernatur praesentium mollitia vero quasi
									quibusdam veritatis. Omnis officia quae quod non ullam,
									corporis ducimus ex inventore ad distinctio nobis maxime, ea
									asperiores? Voluptas aut deleniti nihil at eveniet nobis nulla
									debitis, cupiditate error sed quo distinctio? Ducimus, alias
									consequatur ab ipsa deserunt voluptate rerum sit pariatur esse
									non nemo necessitatibus dolorum fuga. Doloremque cupiditate
									repellendus facere voluptatum, eum facilis hic labore
									distinctio ipsum dolores perferendis dolor voluptate ullam ut
									nam nostrum rem vel totam in nemo!
								</h3>
							</div>
						</div>
					);
				})}
			</Slider>
			<h1 class="[&>span]:text-white">
				Ejemplo <span>Hola</span>
			</h1>
			<StyleProductsLimitSlider />
		</>
	);
}

export function StyleProductsLimitSlider() {
	return (
		<style jsx>{`
            .products-limit-slide .slick-prev:before,
            .slick-next:before {
                color: black;
            }
        `}</style>
	);
}

export default ProductsLimitSlider;
