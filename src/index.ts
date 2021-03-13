import Server from "./server";
import fs from "fs";


try {
    const data = fs.readFileSync("index.json", "utf8")
    const serverList = JSON.parse(data);
    for (const server of serverList.servers) {
        new Server(server.address, server.port, server.password);
    }
} catch (err) {
    console.log("Error reading index.json")
    console.error(err)
}
