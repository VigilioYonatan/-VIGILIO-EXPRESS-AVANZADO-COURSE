import VigilioTable from "~/components/table";
import { useTable } from "@vigilio/preact-table";
import {
	UsersEntitySchemaFormServer,
	UsersSchema,
} from "../schemas/users.schema";
import { usersPaginatorApi } from "@/common/paginator/users.paginator.api";
import {
	UsersIndexMethods,
	usersPaginatorColumns,
	UsersIndexSecondaryPaginator,
} from "../libs/UsersColumn";
import { sweetModal } from "@vigilio/sweet";
import { reactComponent } from "~/libs/preact";
import { lazy } from "preact/compat";
import { usersDestroyApi } from "../apis/users.destroy.api";
// lazy
const UsersStore = lazy(() => import("./UsersCreate"));
const UsersShow = lazy(() => import("./UsersShow"));

function UsersIndex() {
	const usersDestroyApiMutate = usersDestroyApi();
	const table = useTable<
		UsersSchema,
		UsersIndexSecondaryPaginator,
		UsersIndexMethods
	>({
		columns: usersPaginatorColumns,
		methods: {
			usersDestroyApiMutation: usersDestroyApiMutate,
		} as UsersIndexMethods,
	});
	const userIndexApiQuery = usersPaginatorApi(table);
	function onUserStoreModal() {
		sweetModal({
			html: reactComponent(<UsersStore refetch={userIndexApiQuery.refetch} />),
			sweetWidth: "800px",
		});
	}

	function showUser(user: UsersEntitySchemaFormServer) {
		sweetModal({
			html: reactComponent(<UsersShow params={{ id: String(user.id) }} />),
			sweetWidth: "800px",
		});
	}
	return (
		<div class="p-6">
			<div class="mb-3">
				<button
					class="bg-primary px-4 py-2 rounded-md text-white text-sm"
					type="button"
					aria-label="create a new user"
					onClick={onUserStoreModal}
				>
					<i class="fa-solid fa-users" /> Crear Usuario
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

export default UsersIndex;
