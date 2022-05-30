// runServer.js
// require("dotenv").config()
const exec = require("child_process").exec;
const path = require("path");

const PORT = process.env.PORT || 4000;
const workDir = path.join(__dirname, "..");

const command_1 = "npm run docker-build:dev";
const command_2 = `docker run --name jumbobids_user@1.0.0 -e NODE_ENV=development -p ${PORT}:${PORT} -v ${workDir}/src:/usr/src/stem:ro jumbobids_user_dev:1.0.0`;
// console.log("command", command);

// const command = `docker run -d -p 5000:5000 --env-file=../.env alpine`;

exec(command_1, err => {
	if (!err) console.log("Docker is building");

	if (err) {
		console.log("uh oh, Did you run `npm run docker-build:dev?\n`");
		console.log("opps:: could not build image: ", err);
        process.exit();
	}
});
exec(command_2, err => {
	if (!err) console.log("Docker server has been started...✰✨");

	if (err) {
		console.log("Error running server: ", err);
        process.exit();
	}
});
