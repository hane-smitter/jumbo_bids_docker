// runServer.js
const path = require("path");
const exec = require("child_process").exec;

const workDir = path.join(__dirname, "..");
const envPath = path.join(workDir, "../.env");
console.log("envPath", envPath);
require("dotenv").config({ path: envPath });

console.log("Docker API application stopping...");
//start-server:redis
const command_1 = `npm run stop-server:mongo`,
	command_2 = `npm run stop-server:redis`,
	command_3 = `docker network disconnect redis_net ${process.env.API_CONTAINER_NAME}`,
	command_4 = `docker network disconnect mongodb_net ${process.env.API_CONTAINER_NAME}`,
	command_5 = `docker network rm mongodb_net redis_net 1>/dev/null 2>&1 || true`,
	command_6 = `docker stop ${process.env.API_CONTAINER_NAME} -f 1>/dev/null 2>&1 || true`,
	command_7 = `docker rm ${process.env.API_CONTAINER_NAME} -f 1>/dev/null 2>&1 || true`,
	command_8 = `npm run docker-rmi:dev`;

const masterCommand = `${command_1}  && ${command_2} && ${command_3} && ${command_4} && ${command_5} && ${command_6} && ${command_7} && ${command_8}`;

if (process.platform === "linux") {
	exec(masterCommand, err => {
		if (!err) {
			console.log("Application stopped!");
		}

		if (err) {
			console.log("Error stopping server: ", err);
			process.exit();
		}
	});
} else {
	console.log(`This system is currently not supported (${process.platform})`);
}
