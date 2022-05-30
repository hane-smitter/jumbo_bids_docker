import Typesense from "typesense";
import { decode } from "html-entities";

import ProductBidDetail from "../../models/ProductBidDetail.js";

let CONNECTION_URL = process.env.MONGODB;
if (
	process.env.NODE_ENV === "development" &&
	process.env.RUN_CONTEXT_ENV === "docker"
) {
	console.log("process.env.RUN_CONTEXT_ENV", process.env.RUN_CONTEXT_ENV);
	CONNECTION_URL = process.env.MONGODB_DOCKER;
} else if (process.env.NODE_ENV === "development") {
	CONNECTION_URL = process.env.MONGODB_LOCAL;
}

// Test Typesense ----HELLLOOOOOOOOO! OVER HERE

function closeChangeStream(timeInMs = 60000, changeStream) {
	return new Promise(resolve => {
		setTimeout(() => {
			console.log("Closing the change stream");
			changeStream.close();
			resolve();
		}, timeInMs);
	});
}

async function index(next, typesense) {
	console.log("HERE IS THE NEXT VALUE FROM TYPESENSE");
	console.log(next);
	if (next.operationType == "delete") {
		await typesense
			.collections("biddable_products")
			.documents(next.documentKey._id)
			.delete();
		console.log(next.documentKey._id);
	} else if (next.operationType == "update") {
		const bid_prods = await ProductBidDetail.findById(
			next.documentKey._id
		).populate({
			path: "product",
			populate: { path: "category", select: "name description" }
		});
		const updateObj = {
			startTime: bid_prods.startTime,
			name: bid_prods.product.name,
			image: bid_prods.product.thumbnail,
			bidPrice: bid_prods.bidPrice,
			brand: bid_prods.product.brand,
			category: decode(bid_prods.product.category.name || ""),
			cat_desc: decode(added_bid_prod.product.category.description || ""),
			productId: added_bid_prod.product._id
		};
		// const biddableProducts = await ProductBidDetail.find({
		// 	endTime: { $gt: new Date().toISOString() },
		// 	startTime: { $lte: new Date().toISOString() },
		// 	status: "Active",
		//   })
		// 	.populate({
		// 	  path: "product",
		// 	  match,
		// 	})
		// 	.populate({
		// 	  path: "prodbids",
		// 	  options: { limit: 1, sort: "-updatedAt" },
		// 	  populate: { path: "user", select: "surname othername location -_id" },
		// 	});

		const data = JSON.stringify(updateObj);
		await typesense
			.collections("biddable_products")
			.documents(next.documentKey._id)
			.update(data);
		console.log(data);
	} else {
		const added_bid_prod = await ProductBidDetail.findById(
			next.fullDocument._id
		).populate({
			path: "product",
			populate: { path: "category", select: "name description" }
		});
		const addedObj = {
			startTime: added_bid_prod.startTime,
			name: added_bid_prod.product.name,
			image: added_bid_prod.product.thumbnail,
			bidPrice: added_bid_prod.bidPrice,
			brand: added_bid_prod.product.brand,
			category: decode(added_bid_prod.product.category.name || ""),
			cat_desc: decode(added_bid_prod.product.category.description || ""),
			productId: added_bid_prod.product._id
		};
		addedObj.id = next.fullDocument["_id"];
		delete addedObj._id;
		console.log("OBJECT to be added to TYPESENSE", addedObj);
		const data = JSON.stringify(addedObj);
		await typesense.collections("biddable_products").documents().upsert(data);
		console.log("inserted data into typesesne: ");
		console.log(data);
	}
}

async function monitorListingsUsingEventEmitter(typesense, timeInMs = 60000) {
	const changeStream = ProductBidDetail.watch();
	changeStream.on("change", next => {
		console.log("ProductBidDetail has changed!!");
		index(next, typesense);
	});
	// await closeChangeStream(timeInMs, changeStream);
}

async function createSchema(schema, typesense) {
	const collectionsList = await typesense.collections().retrieve();
	const toCreate = collectionsList.find((value, index, array) => {
		return value["name"] == schema["name"];
	});

	if (!toCreate) {
		await typesense.collections().create(schema);
	}
}

export default function main() {
	return new Promise(async (resolve, reject) => {
		try {
			const typesense = new Typesense.Client({
				nodes: [
					{
						host: process.env.TYPESENSE_CLOUD_HOST || "localhost",
						port: process.env.TYPESENSE_CLOUD_PORT || "8108",
						protocol: process.env.TYPESENSE_CLOUD_PROTOCOL || "http"
					}
				],
				apiKey: process.env.TYPESENSE_ADMIN_API_KEY,
				connectionTimeoutSeconds: 7
			});

			const schema = {
				name: "biddable_products",
				fields: [
					{ name: "startTime", type: "string", facet: false },
					{ name: "name", type: "string", facet: false },
					{ name: "brand", type: "string", facet: false },
					{ name: "category", type: "string", facet: true },
					{ name: "image", type: "string", facet: false },
					{ name: "bidPrice", type: "int32", facet: false },
					{ name: "cat_desc", type: "string", facet: false },
					{ name: "productId", type: "string", facet: false }
				],
				default_sorting_field: "bidPrice"
			};

			createSchema(schema, typesense);
			resolve();

			await monitorListingsUsingEventEmitter(typesense, 3600000);
		} catch (err) {
			reject();
			console.error(err);
		}
	});
}
