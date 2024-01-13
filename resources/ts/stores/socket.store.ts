import { signal } from "@preact/signals";
import { useEffect } from "preact/hooks";
import socket, { Socket } from "socket.io-client";
const init = socket({ transports: ["websocket"] });
const io = signal<Socket | null>(null);
const isConnect = signal(false);
function useSocketStore() {
	useEffect(() => {
		io.value = init.connect();
		return () => {
			io.value?.disconnect();
		};
	}, []);

	useEffect(() => {
		io.value?.on("connect", () => {
			isConnect.value = true;
		});
		return () => {
			io.value?.off("connect");
		};
	}, [io.value]);
	useEffect(() => {
		io.value?.on("disconnect", () => {
			isConnect.value = false;
		});
		return () => {
			io.value?.off("disconnect");
		};
	}, [io.value]);
	return {
		io: io.value,
		computeds: {
			isConnect: isConnect.value,
		},
	};
}

export default useSocketStore;
