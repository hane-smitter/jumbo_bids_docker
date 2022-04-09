// runServer.js
const path = require("path");

const dockerEnvPath = path.join(__dirname, "../../.env");
const envPath = dockerEnvPath;
require("dotenv").config({ path: envPath });

const exec = require("child_process").exec;

// Linux commands
const command_1 = `docker network disconnect mongodb_net ${process.env.MONGO_CONTAINER_NAME} 1>/dev/null 2>&1 || true`,
	command_2 = `docker stop ${process.env.MONGO_CONTAINER_NAME} 1>/dev/null 2>&1 || true`,
	command_3 = `docker rm ${process.env.MONGO_CONTAINER_NAME} 1>/dev/null 2>&1 || true`,
	command_4 = `docker network rm mongodb_net -f 1>/dev/null 2>&1 || true`;

const linuxCommand = `${command_1} && ${command_2}  &&  ${command_3} && ${command_4}`;

if (process.platform === "linux") {
	exec(linuxCommand, err => {
		if (!err) console.log("Docker MONGODB has been stopped Successfully...✰✨");

		if (err) {
			console.log("Error running MONGODB: ", err);
			process.exit();
		}
	});
} else {
	console.log(`Oops!, This platform (${process.platform}) is not supported.`);
}
