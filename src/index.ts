import fs from "fs";
import Server from "./server";

try {
	const data = fs.readFileSync("config.json", "utf8");
	const serverList = JSON.parse(data);
	for (const server of serverList.servers) {
		new Server(server.address, server.port, server.password);
	}
} catch (err) {
	console.log("Error reading config.json");
	console.error(err);
}
