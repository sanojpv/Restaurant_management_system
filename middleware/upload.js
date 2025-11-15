// import multer from "multer";
// import path from "path";
// import fs from "fs";

// // Ensure uploads folder exists
// const uploadDir = path.join(process.cwd(), "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadDir),
// filename: (req, file, cb) => {
//   cb(null, Date.now() + path.extname(file.originalname)); // unique name
// }
// });

// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) cb(null, true);
//     else cb(new Error("Only images are allowed (jpg, png, webp)"));
//   },
// });

// export default upload;





// /middleware/upload.js

import multer from "multer";
import { v2 as cloudinary } from 'cloudinary'; 
import pkg from 'multer-storage-cloudinary';

// Use the correct import method for CommonJS modules in ESM
const CloudinaryStorage = pkg.CloudinaryStorage || pkg; 
// Often the export is nested within the default or is the default itself

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
