// build image.js
const path = require("path");
const exec = require("child_process").exec;

const dockerEnvPath = path.join(__dirname, "../../.env");
require("dotenv").config({ path: dockerEnvPath });

const command = `docker build -t ${process.env.API_IMAGE_NAME} -f Dockerfile.dev .`;

exec(command, err => {
	if (!err) console.log("Docker Image is BUILT...✰✨(" + process.env.API_IMAGE_NAME + ")");

	if (err) {
		console.log("Error BUILDING image: ", err);
	}
});
