


// /middleware/upload.js

import multer from "multer";
import { v2 as cloudinary } from 'cloudinary'; 
import pkg from 'multer-storage-cloudinary';

const CloudinaryStorage = pkg.CloudinaryStorage || pkg; 

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
 cloudinary: cloudinary,
 params: {
  folder: "restaurant",
  allowed_formats: ["jpg", "jpeg", "png", "webp"],
 },
});

// Pass storage to multer
const upload = multer({ storage });

export default upload;
