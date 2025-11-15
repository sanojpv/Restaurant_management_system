// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import path from "path";
// import connectDB from "./config/database.js";

// import adminRoutes from "./routes/adminRouter.js";
// import staffRouter from "./routes/staffRouter.js";
// import customerRoutes from "./routes/customerRouter.js";
// import menuRoutes from "./routes/menuRouter.js";
// import orderRoutes from "./routes/orderRouter.js";
// import paymentRoutes from "./routes/paymentRouter.js";
// import reservationRoutes from "./routes/reservationRouter.js";
// import authRouter from "./routes/authRoutes.js";
// import cartRouter from "./routes/cartRouter.js";

// dotenv.config();
// connectDB();

// const app = express();

// // app.use(cors());
// app.use(express.json());



// const allowedOrigins = ['https://restaurant-management-system-fronte-eight.vercel.app'];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
//   credentials: true // Cookies/Session 
// }));
// // Routes
// app.use("/api/auth", authRouter);
// app.use("/api/admin", adminRoutes);
// app.use("/api/staff", staffRouter);
// app.use("/api/customer", customerRoutes);
// app.use("/api/menu", menuRoutes);
// app.use("/api/cart", cartRouter);
// app.use("/api/orders", orderRoutes);
// app.use("/api/payment", paymentRoutes);
// app.use("/api/reservation", reservationRoutes);
// app.use("/uploads", express.static("uploads"));

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


















import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { v2 as cloudinary } from 'cloudinary'; // Import cloudinary v2
import connectDB from "./config/database.js";

import adminRoutes from "./routes/adminRouter.js";
import staffRouter from "./routes/staffRouter.js";
import customerRoutes from "./routes/customerRouter.js";
import menuRoutes from "./routes/menuRouter.js";
import orderRoutes from "./routes/orderRouter.js";
import paymentRoutes from "./routes/paymentRouter.js";
import reservationRoutes from "./routes/reservationRouter.js";
import authRouter from "./routes/authRoutes.js";
import cartRouter from "./routes/cartRouter.js";

dotenv.config();

// 💡 FIX 1: Configure Cloudinary here immediately after loading .env
// This prevents crashes (502 errors) when upload.js is initialized or used.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});


connectDB();

const app = express();

app.use(express.json());


// 💡 FIX 2: CORS Configuration to allow frontend access
const allowedOrigins = ['https://restaurant-management-system-fronte-eight.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    // Allows requests from the specific frontend, or requests with no origin (like Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      // Log the disallowed origin for debugging
      console.error(`CORS Blocked: Request from disallowed origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Important for sending cookies/tokens
}));

// Routes
app.use("/api/auth", authRouter);
app.use("/api/admin", adminRoutes);
app.use("/api/staff", staffRouter);
app.use("/api/customer", customerRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/cart", cartRouter);
app.use("/api/orders", orderRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/reservation", reservationRoutes);
app.use("/uploads", express.static("uploads"));

// Server listen on the correct environment port (process.env.PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));