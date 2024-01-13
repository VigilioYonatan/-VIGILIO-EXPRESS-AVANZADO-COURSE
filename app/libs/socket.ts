import { ServerMiddleware } from "@decorators/socket";
import socket from "socket.io";
export class GlobalMiddleware implements ServerMiddleware {
	public use(
		_io: socket.Server | socket.Namespace,
		_socket: socket.Socket,
		next: () => void,
	) {
		// biome-ignore lint/suspicious/noConsoleLog: <explanation>
		console.log("inicializando socket");
		next();
	}
}
