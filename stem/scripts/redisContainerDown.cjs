// runRedisServer.js
const path = require("path");

const dockerEnvPath = path.join(__dirname, "../../.env");
const envPath = dockerEnvPath;
require("dotenv").config({ path: envPath });

const exec = require("child_process").exec;

const command_1 = `docker network disconnect redis_net ${process.env.REDIS_CONTAINER_NAME} 1>/dev/null 2>&1 || true`,
	command_2 = `docker stop ${process.env.REDIS_CONTAINER_NAME} 1>/dev/null 2>&1 || true`,
	command_3 = `docker network rm redis_net 1>/dev/null 2>&1 || true`,
	command_4 = `docker rm ${process.env.REDIS_CONTAINER_NAME} 1>/dev/null 2>&1 || true`;

const linuxCommand = `${command_1} && ${command_2}  && ${command_3} && ${command_4}`;

if (process.platform === "linux") {
	exec(linuxCommand, err => {
		if (!err) console.log("Docker REDIS has been started...✰✨");

		if (err) {
			console.log("Error running REDIS: ", err);
		}
	});
} else {
	console.log(
		"This platform (%s) is currently not supported!",
		process.platform
	);
}
