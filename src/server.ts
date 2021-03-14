import { Socket } from "net";

export default class Server {
	address: string;
	port: number;
	rconPassword: string;
	reconnectTime: number;

	socket = new Socket();

	bans: string[] = [];
	unbans: string[] = [];

	static servers: Server[] = [];

	constructor(address: string, port: number, rconPassword: string, reconnectTime = 30) {
		this.address = address;
		this.port = port;
		this.rconPassword = rconPassword;
		this.reconnectTime = reconnectTime * 1000;

		this.init();

		Server.servers.push(this);
	}

	private init() {
		this.bans = [];
		this.unbans = [];

		this.connect();

		this.socket.on("end", () => {
			console.log(`Connection ended with ${this.address}:${this.port}. Attempting to reconnect.`);
			this.scheduleReconnect();
		});

		this.socket.on("timeout", () => {
			console.log(`Connection timed out with ${this.address}:${this.port}. Attempting to reconnect.`);
			this.scheduleReconnect();
		});

		this.socket.on("error", (err) => {
			console.log(`${err}. Attempting to reconnect.`);
			this.scheduleReconnect();
		});

		this.socket.on("data", (buffer: Buffer) => {
			const data = buffer.toString().trim();

			const ban = this.parseBan(data);
			if (ban) {
				const index = this.bans.indexOf(ban.username);
				if (index > -1) {
					this.bans.splice(index, 1);
				} else {
					this.propagateBan(ban);
				}
			}

			const unban = this.parseUnban(data);
			if (unban) {
				const index = this.unbans.indexOf(unban.username);
				if (index > -1) {
					this.unbans.splice(index, 1);
				} else {
					this.propagateUnban(unban);
				}
			}
		});
	}

	private connect() {
		this.socket = new Socket();
		this.socket.connect({ host: this.address, port: this.port }, () => {
			this.socket.write(`${this.rconPassword}\n`);
			console.log(`Connected to ${this.address}:${this.port}`);
		});
	}

	private scheduleReconnect() {
		setTimeout(this.init.bind(this), this.reconnectTime);
	}

	private parseBan(data: string): Ban | null {
		if (data.startsWith("BAN")) {
			const parts = data.split(" ");
			return {
				username: parts[1],
				minutes: parseInt(parts[2]),
				reason: parts.slice(3).join(" "),
			};
		}

		return null;
	}

	private parseUnban(data: string): Unban | null {
		if (data.startsWith("UNBAN")) {
			const parts = data.split(" ");
			return {
				username: parts[1],
			};
		}

		return null;
	}

	private propagateBan(ban: Ban) {
		console.log(`Banning: ${ban.username} for ${ban.minutes}`);
		for (const server of Server.servers) {
			if (this === server) continue;

			server.bans.push(ban.username);
			server.socket.write(`/ban ${ban.username} ${ban.minutes} ${ban.reason}\n`);
		}
	}

	private propagateUnban(unban: Unban) {
		console.log(`Unbanning: ${unban.username}`);
		for (const server of Server.servers) {
			if (this === server) continue;

			server.unbans.push(unban.username);
			server.socket.write(`/unban ${unban.username}\n`);
		}
	}
}

interface Unban {
	username: string;
}

interface Ban {
	username: string;
	minutes: number;
	reason: string;
}
