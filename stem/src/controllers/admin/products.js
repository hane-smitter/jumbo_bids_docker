import fs from "fs";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import schedule from "node-schedule";
import { CronJob } from "cron";

import Product from "../../models/Product.js";
import { clearCacheKey } from "../../db/services/cache.js";
import ProductBidDetail from "../../models/ProductBidDetail.js";
import Category from "../../models/Category.js";
import ErrorResponse from "../../_helpers/error/ErrorResponse.js";
import cloudinary from "../utils/cloudinary/cloudinary.js";

const scheduleTask = schedule.scheduleJob.bind(schedule);
// scheduled task executer
function bidEndtimeUpdater(id) {
	// console.log("End Time updatter running!");
	const rule = new schedule.RecurrenceRule();
	rule.hour = 23;
	let current = new Date();
	let task = {};
	task = scheduleTask(rule, async function (fireDate) {
		console.log("scheduled update running...@ " + fireDate);
		const item = await ProductBidDetail.findById(id);
		if (item.extraSlots !== 0) {
			console.log("extra slots not yet zero, endtime updating...");
			const updated = await ProductBidDetail.findByIdAndUpdate(
				item._id,
				{
					endTime: new Date().setHours(current.getHours() + 24)
				},
				{ returnDocument: "after" }
			);
			console.log("updated", updated);
		} else {
			// console.log("task(End time updater) has just been cancelled");
			task?.cancel();
			clearCacheKey("productbiddetails");
		}
	});
	return task;
}
/**
 * 
 * @param {string} id - id of the products
 * @param {Date} date - date(Endtime date)
 */
function bidEndtimeUpdater_v2(id, date) {
	date = new Date(date);
	const runs = `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} * * *`;
	console.log(
		"bidEndtimeUpdater_v2 has been called and cron date created is:: ",
		runs
	);
	const job = new CronJob(runs, async function () {
		console.log("Cron2 executed at: " + runs);
		const item = await ProductBidDetail.findById(id);
		if (item.extraSlots !== 0) {
			console.log("extra slots not yet zero, endtime_V2 updating...");
			const updated = await ProductBidDetail.findByIdAndUpdate(
				item._id,
				{
					endTime: new Date(
						new Date().setHours(new Date().getHours() + 24)
					).toISOString()
				},
				{ returnDocument: "after" }
			);
			// console.log("updated", updated);
		} else {
			// console.log("task(End time updater) has just been cancelled");
			stopJob();
			clearCacheKey("productbiddetails");
		}
	});
	job.start();
	function stopJob() {
		job.stop();
	}
	// console.log("End Time updatter running!");

	return job;
}

export const getProducts = async (req, res, next) => {
	try {
		const products = await Product.find({})
			.sort([["createdAt", -1]])
			.populate(["productbids", "productbidscount"]);
		/* .exec(function(error, bids) {
            if(error) throw error;
            console.log('here is the bids meen!!');
            console.log(bids.productbids);
        }); */
		res.json(products);
	} catch (err) {
		console.log(err);
		next(new ErrorResponse(err.message, 500));
	}
};

export const getBiddableProducts = async (req, res, next) => {
	try {
		const { page } = req.query;

		const LIMIT = 40;
		const startIndex = (Number(page || 1) - 1) * LIMIT; //get starting index of every page
		const total = await ProductBidDetail.countDocuments({
			endTime: { $gt: new Date().toISOString() },
			status: "Active"
		});

		const match = new Object();
		if (req.query.category) {
			let category = req.query.category;
			match.category_slug = category;
		}
		if (req.query.search) {
			const search = new RegExp(req.query.search, "i");

			const biddableProducts = await ProductBidDetail.find({
				endTime: { $gt: new Date().toISOString() },
				status: "Active"
			})
				.populate({
					path: "product",
					match
				})
				.sort([["endTime", 1]]);
			res.json(biddableProducts);
		} else {
			const biddableProducts = await ProductBidDetail.find({
				// endTime: { $gt: new Date().toISOString() },
				status: "Active"
			})
				.populate({
					path: "product",
					match
				})
				.sort([["endTime", 1]])
				.limit(LIMIT)
				.skip(startIndex);
			// res.json({
			//   data: biddableProducts,
			//   currentPage: Number(page),
			//   numberOfPages: Math.ceil(total / LIMIT),
			// });
			// const biddableProducts = await ProductBidDetail.find({
			//   endTime: { $gt: new Date().toISOString() },
			//   status: "Active",
			// })
			//   .populate({
			//     path: "product",
			//     match,
			//   })
			//   .sort([["endTime", 1]]);
			res.json(biddableProducts);
		}
	} catch (err) {
		next(err);
	}
};

export const createProduct = async (req, res, next) => {
	const errors = validationResult(req);
	let fileErr = [];
	if (!req.file) {
		fileErr.push({
			value: "",
			msg: "Please upload a file",
			param: "productimg",
			location: "body"
		});
	}

	try {
		if (!errors.isEmpty() || !req.file) {
			let errorsBag = [...errors.array(), ...(fileErr || [])];
			throw new ErrorResponse(undefined, 422, errorsBag);
		}

		const {
			secure_url,
			public_id: cloudinary_id,
			eager: [_transformed, _thumbnail]
		} = await cloudinary.uploader.upload(req.file.path, {
			folder: "jumbobids/imgs/products",
			eager: [
				{ width: 350, height: 350, crop: "pad" },
				{ transformation: [{ width: 300, height: 300, crop: "scale" }] }
			]
		});

		var path = cloudinary_id;

		// const URL = process.env.APP_URL ?? "https://raw-jumbobids.herokuapp.com";
		// const filePath = `${URL}/imgs/products/${req.file.filename}`;
		const cloudFilePath = secure_url;
		const category = await Category.findById(req.body.category);
		if (!category) throw new ErrorResponse("This Category does not exist", 404);

		let product = new Product({
			...req.body,
			image: _transformed.secure_url,
			image_original: cloudFilePath,
			thumbnail: _thumbnail.secure_url,
			cloudinary_id,
			category: category._id,
			category_slug: category.category_slug
		});
		await product.save();
		res.status(201).json({
			info: {
				message: "Item added successfully!",
				severity: "success",
				code: "createproduct"
			}
		});
	} catch (err) {
		if (path) {
			cloudinary.uploader.destroy(path, function (error, result) {
				if (error) console.log(error);
				console.log(result);
			});
		}

		// req.file &&
		//   fs.unlink(`${req.file.destination}/${req.file.filename}`, (error) => {
		//     if (error) throw error;
		//     console.log("Uploaded file deleted successfully!");
		//   });
		next(err);
	}
};

export const getBidProducts = async (req, res, next) => {
	try {
		const productBids = await ProductBidDetail.find().populate("product");
		res.json(productBids);
	} catch (err) {
		next(err);
	}
};

export const createProductBidDetails = async (req, res, next) => {
	const errors = validationResult(req);
	try {
		if (!errors.isEmpty()) {
			let errorsBag = errors.array();
			throw new ErrorResponse(undefined, 422, errorsBag);
		}

		req.body.startTime = new Date(req.body.startTime).toISOString();
		req.body.endTime = new Date(req.body.endTime).toISOString();

		// create the bid entry
		const savedItem = await ProductBidDetail.create(req.body);

		// ----START---- NEW cron pkg cron configuration
		const whenToRun = new Date(savedItem.endTime);
		console.log("***Cron scheduled to run on BidItem endTime***: " + whenToRun);
		const job = new CronJob(whenToRun, async function () {
			// logic
			console.log("Cron1 executed at: " + whenToRun);
			const product = await ProductBidDetail.findById(savedItem._id);
			let updaterId;
			if (product.extraSlots !== 0) {
				let current = new Date();
				// console.log("hey extraSlots not zeroed out");
				const updatedProd = await ProductBidDetail.findByIdAndUpdate(
					savedItem._id,
					{
						endTime: new Date().setHours(current.getHours() + 24)
					},
					{ returnDocument: "after" }
				);
				// console.log("----updatedProd----", updatedProd);
				updaterId = bidEndtimeUpdater_v2(
					product._id,
					new Date(updatedProd.endTime)
				);
			} else if (updaterId) {
				console.log("updaterId to cancel", updaterId);
				// updaterId.stop();
			}
		});
		job.start();
		// ----END---- NEW cron pkg cron configuration

		// ----START---- node-schedule way of cron task
		/* 
		const when = new Date(savedItem.endTime);
		scheduleTask(when, async function () {
			// console.log("Task scheduled to run on item endTime: " + when);
			let updaterId;
			if (savedItem.extraSlots !== 0) {
				let current = new Date();
				// console.log("hey extraSlots not zeroed out");
				await ProductBidDetail.findByIdAndUpdate(
					savedItem._id,
					{
						endTime: new Date().setHours(current.getHours() + 24)
					},
					{ returnDocument: "after" }
				);
				updaterId = bidEndtimeUpdater(savedItem._id);
			} else if (updaterId) {
				// console.log("updaterId cancelled", updaterId);
				updaterId.cancel();
			}
		});
		*/
		// ----END---- node-schedule way of cron task
		clearCacheKey("productbiddetails");
		res.status(201).json({
			info: {
				message: "Bid details for the product is created successfully",
				severity: "success",
				code: "createproductbiddetails"
			}
		});
	} catch (err) {
		next(err);
	}
};

//delete product
export const deleteProduct = async (req, res, next) => {
	const errors = validationResult(req);
	try {
		if (!errors.isEmpty()) {
			let errorsBag = errors.array();
			throw new ErrorResponse(undefined, 422, errorsBag);
		}

		const productId = req.body.productId;
		if (!productId) throw new ErrorResponse("Provide the product ID", 400);
		const product = await Product.findOneAndDelete({
			_id: mongoose.Types.ObjectId(productId)
		});
		if (!product) throw new ErrorResponse("Product not found", 404);
		let path = product.cloudinary_id;
		if (path) {
			cloudinary.uploader.destroy(path, function (error, result) {
				if (error) return console.log("could not delete file: ", error);
				console.log(
					"Uploaded file deleted successfully!",
					result && result.result
				);
			});
		}
		// const imageUrl = product.image;
		// let capturingRegex = /\/(?<img>[a-zA-Z0-9]+[_]\w+\.(jpe?g|png))$/;
		// const { groups } = imageUrl.match(capturingRegex);
		// const imageName = groups.img;
		// if (imageName) {
		//   fs.unlink(`public/imgs/products/${imageName}`, (error) => {
		//     if (error) {
		//       console.log(error);
		//     } else {
		//       console.log("file deleted successfully");
		//     }
		//   });
		// }
		res.json({
			info: {
				message: "Product has been deleted successfully",
				severity: "success",
				code: "deleteproduct"
			}
		});
	} catch (err) {
		next(err);
	}
};

//update product
export const updateProduct = async (req, res, next) => {
	const errors = validationResult(req);
	try {
		if (!errors.isEmpty()) {
			let errorsBag = errors.array();
			throw new ErrorResponse(undefined, 422, errorsBag);
		}
		if (!req.params.id)
			throw new ErrorResponse("Must provide id of the category", 400);
		const allowedUpdates = ["name", "brand", "image", "cost", "category"];
		const body = req.body;

		const bodyKeys = Object.keys(body);
		const validFields = bodyKeys.filter(bodyKey =>
			allowedUpdates.includes(bodyKey)
		);

		const isValidId = mongoose.isValidObjectId(req.params.id);
		if (!isValidId) throw new ErrorResponse("Invalid ID is provided", 400);

		const product = await Product.findById(req.params.id);
		for (let i = 0; i < validFields.length; i++) {
			product[validFields[i]] = req.body[validFields[i]];
		}

		if (req.file) {
			let path = product.cloudinary_id;
			const [, p2] = await Promise.all([
				cloudinary.uploader.destroy(path),
				cloudinary.uploader.upload(req.file.path, {
					folder: "jumbobids/imgs/products",
					eager: [
						{ width: 350, height: 350, crop: "pad" },
						{ transformation: [{ width: 300, height: 300, crop: "scale" }] }
					]
				})
			]);
			const {
				secure_url,
				public_id: cloudinary_id,
				eager: [_transformed, _thumbnail]
			} = p2;

			product.image = _transformed.secure_url;
			product.image_original = secure_url;
			product.thumbnail = _thumbnail.secure_url;
			product.cloudinary_id = cloudinary_id;
		}

		await product.save();

		res.json({
			info: {
				message: "Product has been updated successfully!",
				severity: "success",
				code: "updateproduct"
			}
		});
	} catch (err) {
		next(err);
	}
};
