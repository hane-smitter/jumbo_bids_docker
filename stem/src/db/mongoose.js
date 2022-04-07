import mongoose from "mongoose";
import chalk from "chalk";

let CONNECTION_URL;
process.env.NODE_ENV === "development"
	? (CONNECTION_URL = process.env.MONGODB_LOCAL)
	: (CONNECTION_URL = process.env.MONGODB);

mongoose.connect(CONNECTION_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

/* 
const client = mongoose.connection.client;
const db = client.db('dbName');
const collection = db.collection('collectionName');
const changeStream = collection.watch();
changeStream.on('change', next => {
    
});
 */

//Bind connection to error event (to get notification of connection errors)
mongoose.connection.on(
	"error",
	console.error.bind(
		console,
		chalk.italic.red.inverse("MongoDB connection error:")
	)
);

export const DB = mongoose.connection;
