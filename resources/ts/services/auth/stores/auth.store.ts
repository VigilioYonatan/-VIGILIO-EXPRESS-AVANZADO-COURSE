import { UsersSchema } from "@/users/schemas/users.schema";
import { signal } from "@preact/signals";

const state = signal<null | UsersSchema>(null);
function useAuthStore() {
	function onInitialAuth(user: UsersSchema) {
		state.value = user;
	}
	return { state: state.value, methods: { onInitialAuth } };
}
export default useAuthStore;
