// runServer.js
const path = require("path");

const dockerEnvPath = path.join(__dirname, "../../.env");
const envPath = dockerEnvPath;
require("dotenv").config({ path: envPath });

const exec = require("child_process").exec;

const PORT = process.env.PORT || 5000;
const workDir = path.join(__dirname, "..");

// const command = `docker run -d --network mongodb_net --name ${process.env.MONGO_CONTAINER_NAME} mongo`;
const command = `docker run -d --name ${process.env.MONGO_CONTAINER_NAME} mongo`;

exec(command, err => {
	if (!err) console.log("Docker MONGODB has been started...✰✨");

	if (err) {
		console.log("Error running MONGODB: ", err);
        process.exit();
	}
});
