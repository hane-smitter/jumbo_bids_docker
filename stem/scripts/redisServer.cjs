// runRedisServer.js
const path = require("path");

const dockerEnvPath = path.join(__dirname, "../../.env");
const envPath = dockerEnvPath;
require("dotenv").config({ path: envPath });

const exec = require("child_process").exec;

const command = `docker run -d --name ${process.env.REDIS_CONTAINER_NAME} -p 6379:6379 -v cache:/data/cache redis redis-server --save 60 1 --requirepass ${process.env.REDIS_PASS} --loglevel warning`;

exec(command, err => {
	if (!err) console.log("Docker REDIS has been started...✰✨");

	if (err) {
		console.log("Error running REDIS: ", err);
	}
});
