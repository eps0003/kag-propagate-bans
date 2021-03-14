import fs from "fs";
import Server from "./server";

try {
	const data = fs.readFileSync("config.json", "utf8");
	const config = JSON.parse(data);
	for (const server of config.servers) {
		new Server(server.address, server.port, server.password, config.reconnectTime);
	}
} catch (err) {
	console.log("Error reading config.json");
	console.error(err);
}
