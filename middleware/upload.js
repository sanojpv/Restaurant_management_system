import multer from "multer";
import pkg from 'multer-storage-cloudinary';
import cloudinary from "../config/cloudinary.js"; // Import the configured instance

const CloudinaryStorage = pkg.CloudinaryStorage || pkg; 

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "restaurant",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({ storage });

export default upload;