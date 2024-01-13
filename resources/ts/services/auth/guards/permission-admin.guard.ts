import useAuthStore from "../stores/auth.store";

function permissionAdminGuard() {
	const { state } = useAuthStore();
	return state?.role_id === 2;
}
export default permissionAdminGuard;
