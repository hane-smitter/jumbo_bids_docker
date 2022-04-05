import mongoose from "mongoose";
import Typesense from "typesense";

import ProductBidDetail from "../../models/ProductBidDetail.js";
import { DB } from "../mongoose.js";

const typesense = new Typesense.Client({
	nodes: [
		{
			host: "localhost",
			port: "8108",
			protocol: "http"
		}
	],
	apiKey: process.env.TYPESENSE_API_KEY,
	connectionTimeoutSeconds: 2
});

const schema = {
	name: "products",
	fields: [
		{ name: "startTime", type: "int64", facet: false },
		{ name: "name", type: "string", facet: false },
		{ name: "brand", type: "string", facet: false },
		{ name: "category", type: "string", facet: true }
	],
	default_sorting_field: "year"
};

export default async function main() {
	console.log("serach typesense should be running");
	const client = mongoose.connection.client;
	const db = client.db("jumbobids");
	const collection = db.collection("productbiddetails");
	const changeStream = collection.watch();
	await prepSearch();
	changeStream.on("change", next => {
		indexSearch(next, typesense);
	});
	await closeChangeStream(timeInMs, changeStream);
}

async function prepSearch() {
	// const data = await ProductBidDetail.find({
	// 	endTime: { $gt: new Date().toISOString() },
	// 	startTime: { $lte: new Date().toISOString() },
	// 	status: "Active"
	// })
	// 	.populate({
	// 		path: "product",
	// 		match
	// 	})
	// 	.populate({
	// 		path: "prodbids",
	// 		options: { limit: 1, sort: "-updatedAt" },
	// 		populate: { path: "user", select: "surname othername location -_id" }
	// 	});
	// const jsonData = JSON.parse(data);

	await typesense.collections().create(schema);
}

async function indexSearch(next, typesense) {
	console.log(next);
	if (next.operationType == "delete") {
		await typesense
			.collections("products")
			.documents(next.documentKey._id)
			.delete();
		console.log(next.documentKey._id);
	} else if (next.operationType == "update") {
		let data = JSON.stringify(next.updateDescription.updatedFields);
		await typesense
			.collections("products")
			.documents(next.documentKey._id)
			.update(data);
		console.log(data);
	} else {
		next.fullDocument.id = next.fullDocument["_id"];
		delete next.fullDocument._id;
		let data = JSON.stringify(next.fullDocument);
		await typesense.collections("products").documents().upsert(data);
		console.log(data);
	}
}

function closeChangeStream(timeInMs = 60000, changeStream) {
	return new Promise(resolve => {
		setTimeout(() => {
			console.log("Closing the change stream");
			changeStream.close();
			resolve();
		}, timeInMs);
	});
}
