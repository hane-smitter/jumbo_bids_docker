// runServer.js
require("dotenv").config()
const exec = require("child_process").exec;

// const command_1 = `mkdir /tmp/typesense-data`

// const command_1 = `docker pull typesense/typesense:0.22.2`;

const command = `docker run -p 8108:8108 -v /tmp/typesense-data:/data typesense/typesense:0.22.2 \
--data-dir /data --api-key=${process.env.TYPESENSE_API_KEY}`;

// const command = `docker run -d -p 5000:5000 --env-file=../.env alpine`;

exec(command, err => {
	if (!err) console.log("Docker server has been started...✰✨");

	if (err) {
		console.log("Error running server: ", err);
	}
});
