import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
  cloud_name: process.env.IMGHOST_CLOUD_NAME,
  api_key: process.env.IMGHOST_API_KEY,
  api_secret: process.env.IMGHOST_API_SECRET,
});
export default cloudinary;
