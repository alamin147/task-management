import cloudinary from "cloudinary";

export const configserverENV = {
  cloud_name: process.env.CLOUD_NAME,
  cloud_api_key: process.env.CLOUD_API_KEY,
  cloud_api_secret: process.env.CLOUD_API_SECRET,
};
export const cloudinaryConfig = cloudinary.v2.config(configserverENV);
