// runServer.js
const path = require("path");

const dockerEnvPath = path.join(__dirname, "../../.env");
const envPath = dockerEnvPath;
require("dotenv").config({ path: envPath });

const exec = require("child_process").exec;

const PORT = process.env.PORT || 5000;
const workDir = path.join(__dirname, "..");

console.log("Host OS: %s\n", process.platform);

const command_1 = `docker rm ${process.env.MONGO_CONTAINER_NAME} -f 1>/dev/null 2>&1 || true`,
	command_2 = `docker network create mongodb_net 1>/dev/null 2>&1 || true`,
	command_3 = `docker run -d --name ${process.env.MONGO_CONTAINER_NAME} mongo:4.4.6`,
	command_4 = `docker network connect --alias mongo --alias database --alias db mongodb_net ${process.env.MONGO_CONTAINER_NAME}`;

const linuxCommand = `${command_1} && ${command_2}  &&  ${command_3} && ${command_4}`;
// const command = `docker run -d --name ${process.env.MONGO_CONTAINER_NAME} mongo`;

if (process.platform === "linux") {
	exec(linuxCommand, err => {
		if (!err) console.log("Docker MONGODB has been started...✰✨");

		if (err) {
			console.log("Error running MONGODB: ", err);
			process.exit();
		}
	});
} else {
	console.log(`Oops!, This platform (${process.platform}) is not supported.`);
}
