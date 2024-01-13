import VigilioTable from "~/components/table";
import { useTable } from "@vigilio/preact-table";
import {
	ProductsEntitySchemaFromServer,
	ProductsSchema,
} from "../schemas/products.schema";
import { productsPaginatorApi } from "@/common/paginator/products.paginator.api";
import {
	ProductsIndexMethods,
	productsPaginatorColumns,
	ProductsIndexSecondaryPaginator,
} from "../libs/ProductsColumn";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { lazy } from "preact/compat";
import { productsDestroyApi } from "../apis/products.destroy.api";
import permissionAdminGuard from "@/auth/guards/permission-admin.guard";
// lazy
const ProductsStore = lazy(() => import("./ProductsCreate"));
const ProductsShow = lazy(() => import("./ProductsShow"));

function ProductsIndex() {
	const productsDestroyApiMutate = productsDestroyApi();
	productsDestroyApiMutate.mutate;
	const table = useTable<
		ProductsSchema,
		ProductsIndexSecondaryPaginator,
		ProductsIndexMethods
	>({
		columns: productsPaginatorColumns,
		methods: {
			productsDestroyApiMutation: productsDestroyApiMutate,
		} as ProductsIndexMethods,
	});
	const userIndexApiQuery = productsPaginatorApi(table);
	function onProductstoreModal() {
		sweetModal({
			html: reactComponent(
				<ProductsStore refetch={userIndexApiQuery.refetch} />,
			),
			sweetWidth: "800px",
		});
	}

	function showUser(user: ProductsEntitySchemaFromServer) {
		sweetModal({
			html: reactComponent(<ProductsShow params={{ id: String(user.id) }} />),
			sweetWidth: "800px",
		});
	}
	return (
		<div class="p-6">
			{permissionAdminGuard() ? (
				<div class="mb-3">
					<button
						class="bg-primary px-4 py-2 rounded-md text-white text-sm"
						type="button"
						aria-label="create a new product"
						onClick={onProductstoreModal}
					>
						<i class="fas fa-boxes" /> Crear Producto
					</button>
				</div>
			) : null}

			<div class="overflow-auto">
				<VigilioTable query={userIndexApiQuery} table={table}>
					<VigilioTable.header>
						<VigilioTable.header.limit />
						<VigilioTable.header.tools hiddenInput={false} />
					</VigilioTable.header>
					<VigilioTable.table>
						<VigilioTable.thead>
							<VigilioTable.thead.row>
								<VigilioTable.thead.th />
							</VigilioTable.thead.row>
						</VigilioTable.thead>
						<VigilioTable.tbody>
							<VigilioTable.tbody.row handleClick={showUser}>
								{(data) => <VigilioTable.tbody.td data={data} />}
							</VigilioTable.tbody.row>
						</VigilioTable.tbody>
					</VigilioTable.table>
					<VigilioTable.footer>
						<VigilioTable.footer.paginator />
					</VigilioTable.footer>
				</VigilioTable>
			</div>
		</div>
	);
}

export default ProductsIndex;
