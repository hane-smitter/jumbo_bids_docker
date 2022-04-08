// runServer.js
const path = require("path");
const exec = require("child_process").exec;

const workDir = path.join(__dirname, "..");
const envPath = path.join(workDir, "../.env");
console.log("envPath", envPath);
require("dotenv").config({ path: envPath });

const PORT = process.env.PORT || process.env.API_DEV_PORT || 8000;
console.log("port env", PORT);
//start-server:redis
const command_1 = `npm run start-server:mongo`,
	command_2 = `npm run start-server:redis`,
	command_3 = `npm run docker-build:dev`,
	command_4 = `docker rm ${process.env.API_CONTAINER_NAME} -f 1>/dev/null 2>&1 || true`,
	command_5 = `docker run --name ${process.env.API_CONTAINER_NAME} --network redis_net --network mongodb_net --env-file ./.env -p ${PORT}:${PORT} -v ${workDir}/src:/usr/src/stem/src:ro ${process.env.API_IMAGE_NAME}`;
	// command_6= `docker network connect redis_net ${process.env.API_CONTAINER_NAME}`;

const masterCommand = `${command_1}  && ${command_2} && ${command_3} && ${command_4} && ${command_5}`;

if (process.platform === "linux") {
	exec(masterCommand, err => {
		if (!err) console.log("Docker server has been started...✰✨");

		if (err) {
			// console.log("uh oh, Did you run `npm run docker-build:dev?\n`");
			console.log("Error running server: ", err);
			process.exit();
		}
	});
} else {
	console.log(`This system is currently not supported (${process.platform})`);
}
