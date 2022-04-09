// build image.js
const path = require("path");
const exec = require("child_process").exec;

const dockerEnvPath = path.join(__dirname, "../../.env");
const logs = path.join(__dirname, "../");
require("dotenv").config({ path: dockerEnvPath });

const command = `docker build -t ${process.env.API_IMAGE_NAME} -f Dockerfile.dev . 2>&1 | sed "s/^/\`date '+%Y-%m-%d %H:%M:%S'\`: [docker build] /" 1>>${logs}/docker.log 2>>${logs}/docker_error.log`;

exec(command, err => {
	if (!err) console.log("Docker Image is BUILT...✰✨(" + process.env.API_IMAGE_NAME + ")");

	if (err) {
		console.log("Error BUILDING image: ", err);
	}
});
