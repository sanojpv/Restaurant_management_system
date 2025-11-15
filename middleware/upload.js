


// // /middleware/upload.js

// import multer from "multer";
// import { v2 as cloudinary } from 'cloudinary'; 
// import pkg from 'multer-storage-cloudinary';

// const CloudinaryStorage = pkg.CloudinaryStorage || pkg; 

// // Configure Cloudinary storage
// const storage = new CloudinaryStorage({
//  cloudinary: cloudinary,
//  params: {
//   folder: "restaurant",
//   allowed_formats: ["jpg", "jpeg", "png", "webp"],
//  },
// });

// // Pass storage to multer
// const upload = multer({ storage });

// export default upload;












// /middleware/upload.js

import multer from "multer";
import { v2 as cloudinary } from 'cloudinary'; 
import pkg from 'multer-storage-cloudinary';

// 💡 FIX 3: Using the most reliable extraction method for CommonJS class constructor in ESM
const CloudinaryStorage = pkg.CloudinaryStorage;

if (!CloudinaryStorage) {
    // Fallback in case the export structure is different
    throw new Error("CloudinaryStorage constructor not found. Check multer-storage-cloudinary import.");
}

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