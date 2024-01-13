import VigilioTable from "~/components/table";
import { useTable } from "@vigilio/preact-table";
import { RolesSchema, RolesSchemaFromServer } from "../schemas/roles.schema";
import { rolesPaginatorApi } from "@/common/paginator/roles.paginator.api";
import {
	RolesIndexMethods,
	rolesPaginatorColumns,
	RolesIndexSecondaryPaginator,
} from "../libs/RolesColumn";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { lazy } from "preact/compat";
import { rolesDestroyApi } from "../apis/roles.destroy.api";
// lazy
const RolesStore = lazy(() => import("./RolesCreate"));
const RolesShow = lazy(() => import("./RolesShow"));

function RolesIndex() {
	const rolesDestroyApiMutate = rolesDestroyApi();
	rolesDestroyApiMutate.mutate;
	const table = useTable<
		RolesSchema,
		RolesIndexSecondaryPaginator,
		RolesIndexMethods
	>({
		columns: rolesPaginatorColumns,
		methods: {
			rolesDestroyApiMutation: rolesDestroyApiMutate,
		} as RolesIndexMethods,
	});
	const userIndexApiQuery = rolesPaginatorApi(table);
	function onRolestoreModal() {
		sweetModal({
			html: reactComponent(<RolesStore refetch={userIndexApiQuery.refetch} />),
			sweetWidth: "800px",
		});
	}

	function showUser(user: RolesSchemaFromServer) {
		sweetModal({
			html: reactComponent(<RolesShow params={{ id: String(user.id) }} />),
			sweetWidth: "800px",
		});
	}
	return (
		<div class="p-6">
			<div class="mb-3">
				<button
					class="bg-primary px-4 py-2 rounded-md text-white text-sm"
					type="button"
					aria-label="create a new rol"
					onClick={onRolestoreModal}
				>
					<i class="fas fa-user-tag" /> Crear Rol
				</button>
			</div>
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

export default RolesIndex;
