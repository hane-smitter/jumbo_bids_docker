// runRedisServer.js
const path = require("path");

const dockerEnvPath = path.join(__dirname, "../../.env");
const envPath = dockerEnvPath;
require("dotenv").config({ path: envPath });

const exec = require("child_process").exec;

const command_1 = `docker rm ${process.env.REDIS_CONTAINER_NAME} -f 1>/dev/null 2>&1 || true`,
	command_2 = `docker network create redis_net 1>/dev/null 2>&1 || true`,
	command_3 = `docker run -d --name ${process.env.REDIS_CONTAINER_NAME} --network redis_net --network-alias redis --network-alias connectredis -p 6379:6379 -v cache:/data/cache redis redis-server --save 60 1 --requirepass ${process.env.REDIS_PASS} --loglevel warning`;
	// command_4= `docker network disconnect redis_net ${process.env.REDIS_CONTAINER_NAME} 1>/dev/null 2>&1 || true`,
	// command_5= `docker network connect --alias redis --alias connectredis redis_net ${process.env.REDIS_CONTAINER_NAME}`;

const linuxCommand = `${command_1} && ${command_2}  && ${command_3}`;

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
