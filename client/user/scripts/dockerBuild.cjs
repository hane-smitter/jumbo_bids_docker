// build image.js
// require("dotenv").config()
const exec = require("child_process").exec;
// const path = require("path");

const PORT = process.env.PORT || 5000;
// const workDir = path.join(__dirname, "..");

const command = `docker build -t jumbobids_user_dev:1.0.0 -f Dockerfile.dev .`;
// console.log("command", command);

// const command = `docker run -d -p 5000:5000 --env-file=../.env alpine`;

exec(command, err => {
	if (!err) console.log("Docker BUILD is started...✰✨");

	if (err) {
		console.log("Error BUILDING image: ", err);
	}
});
