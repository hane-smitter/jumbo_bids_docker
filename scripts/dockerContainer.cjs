// runServer.js
// require("dotenv").config()
const exec = require("child_process").exec;
const path = require("path");

const PORT = process.env.PORT || 4000;
const workDir = path.join(__dirname, "..");

const command = `docker run --name jumbobids_admin@1.0.0 -e NODE_ENV=development -p ${PORT}:${PORT} -v ${workDir}/src:/usr/src/stem:ro jumbobids_admin_dev:1.0.0`;

exec(command, err => {
	if (!err) console.log("Docker server has been started...✰✨");

	if (err) {
		console.log("uh oh, Did you run `npm run docker-build:dev?\n`");
		console.log("Error running server: ", err);
        process.exit();
	}
});
