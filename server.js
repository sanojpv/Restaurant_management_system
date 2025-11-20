import "dotenv/config";
import express from "express";
import cors from "cors";
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

connectDB();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://restaurant-management-system-fronte-eight.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
