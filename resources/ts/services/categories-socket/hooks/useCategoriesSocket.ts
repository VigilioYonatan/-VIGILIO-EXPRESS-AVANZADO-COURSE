import {
	CategoriesStoreAPI,
	CategoriesStoreAPIError,
} from "@/categories/apis/categories.store.api";
import { CategoriesStoreDto } from "@/categories/dtos/categories.store.dto";
import { CategoriesSchemaFromServer } from "@/categories/schemas/categories.schema";
import { useSignal } from "@preact/signals";
import { sweetModal } from "@vigilio/sweet";
import { useEffect } from "preact/hooks";
import { UseFormReturn } from "react-hook-form";
import enviroments from "~/config";
import useSocketStore from "~/stores/socket.store";

function useCategoriesSocket(
	categoriesStoreForm: UseFormReturn<{
		name: string;
		foto: File[];
		slug: string;
	}>,
) {
	const { io } = useSocketStore();
	const categories = useSignal<null | CategoriesSchemaFromServer[]>(null);
	const isLoadingStore = useSignal(false);
	const isLoadingDestroy = useSignal(false);

	async function onCategoriesStore(categoriesStoreDto: CategoriesStoreDto) {
		isLoadingStore.value = true;
		const formData = new FormData();
		formData.append("name", categoriesStoreDto.name);
		formData.append("file", categoriesStoreDto.foto[0]);
		const responseImage = await fetch(
			`${enviroments.VITE_URL}/api/uploads/categories/foto`,
			{ method: "POST", body: formData },
		);
		const resultImage = await responseImage.json();
		if (!resultImage.success) {
			categoriesStoreForm.setError("foto", {
				message: resultImage.message,
			});
			isLoadingStore.value = false;
			return;
		}

		io?.emit("categories-store", {
			...categoriesStoreDto,
			foto: resultImage.images,
		} as CategoriesStoreDto);
	}

	useEffect(() => {
		io?.on("categories-index", (data: CategoriesSchemaFromServer[]) => {
			categories.value = data;
		});
		return () => {
			io?.off("categories-index");
		};
	}, [io]);
	/* store */
	useEffect(() => {
		io?.on("categories-store:errors", (err: CategoriesStoreAPIError) => {
			if (err.body) {
				categoriesStoreForm.setError(err.body, {
					message: err.message,
				});
			}
		});
		return () => {
			io?.off("categories-store:errors");
		};
	}, [io]);
	useEffect(() => {
		io?.on("categories-store:success", (data: CategoriesStoreAPI) => {
			isLoadingStore.value = false;
			sweetModal({
				icon: "success",
				title: "categoría creado correctamente",
				text: `categoría creado correctamente ${data.category.name}`,
			}).then(() => {
				categoriesStoreForm.reset();
			});
		});
		return () => {
			io?.off("categories-store:success");
		};
	}, [io]);
	/* destroy */
	async function onCategoriesDestroy(id: number) {
		isLoadingDestroy.value = true;
		io?.emit("categories-destroy", id);
	}
	useEffect(() => {
		io?.on(
			"categories-destroy:errors",
			(err: { success: false; message: string }) => {
				sweetModal({
					icon: "danger",
					title: "error al eliminar",
					text: err.message,
				});
				isLoadingDestroy.value = false;
			},
		);
		return () => {
			io?.off("categories-destroy:errors");
		};
	}, [io]);
	useEffect(() => {
		io?.on(
			"categories-destroy:success",
			(data: { success: true; message: string }) => {
				sweetModal({
					icon: "success",
					title: "categoría creado correctamente",
					text: data.message,
				});
				isLoadingDestroy.value = false;
			},
		);
		return () => {
			io?.off("categories-destroy:success");
		};
	}, [io]);
	return {
		computeds: {
			isLoadingDestroy: isLoadingDestroy.value,
			categories: categories.value,
			isLoadingStore: isLoadingStore.value,
		},
		methods: {
			onCategoriesStore,
			onCategoriesDestroy,
		},
	};
}

export default useCategoriesSocket;
