import VigilioTable from "~/components/table";
import { useTable } from "@vigilio/preact-table";
import {
	CategoriesSchemaFromServer,
	CategoriesSchema,
} from "../schemas/categories.schema";
import { categoriesPaginatorApi } from "@/common/paginator/categories.paginator.api";
import {
	CategoriesIndexMethods,
	categoriesPaginatorColumns,
	CategoriesIndexSecondaryPaginator,
} from "../libs/CategoriesColumn";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { lazy } from "preact/compat";
import { categoriesDestroyApi } from "../apis/categories.destroy.api";
// lazy
const CategoriesStore = lazy(() => import("./CategoriesCreate"));
const CategoriesShow = lazy(() => import("./CategoriesShow"));

function CategoriesIndex() {
	const categoriesDestroyApiMutate = categoriesDestroyApi();
	categoriesDestroyApiMutate.mutate;
	const table = useTable<
		CategoriesSchema,
		CategoriesIndexSecondaryPaginator,
		CategoriesIndexMethods
	>({
		columns: categoriesPaginatorColumns,
		methods: {
			categoriesDestroyApiMutation: categoriesDestroyApiMutate,
		} as CategoriesIndexMethods,
	});
	const userIndexApiQuery = categoriesPaginatorApi(table);
	function onCategoriestoreModal() {
		sweetModal({
			html: reactComponent(
				<CategoriesStore refetch={userIndexApiQuery.refetch} />,
			),
		});
	}
	function showUser(user: CategoriesSchemaFromServer) {
		sweetModal({
			html: reactComponent(<CategoriesShow params={{ id: String(user.id) }} />),
		});
	}
	return (
		<div class="p-6">
			<div class="mb-3">
				<button
					class="bg-primary px-4 py-2 rounded-md text-white text-sm"
					type="button"
					aria-label="create a new category"
					onClick={onCategoriestoreModal}
				>
					<i class="fas fa-box" /> Crear Categoría
				</button>
			</div>
			<div class="overflow-auto">
				<VigilioTable query={userIndexApiQuery} table={table}>
					<VigilioTable.header>
						<VigilioTable.header.limit />
						<VigilioTable.header.tools
							hiddenDelete={true}
							hiddenInput={false}
						/>
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

export default CategoriesIndex;
