// Del development image image.js
const path = require("path");
const exec = require("child_process").exec;

const dockerEnvPath = path.join(__dirname, "../../.env");
require("dotenv").config({ path: dockerEnvPath });

const command = `docker rmi ${process.env.API_IMAGE_NAME} 1>/dev/null 2>&1 || true`;

exec(command, err => {
	if (!err) console.log(`Removing ${process.env.API_IMAGE_NAME} (development)...`);

	if (err) {
		console.log("Error REMOVING image: ", err);
	}
});
