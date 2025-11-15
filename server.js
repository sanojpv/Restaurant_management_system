import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
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
connectDB();

const app = express();

// app.use(cors());
app.use(express.json());



// ഫ്രണ്ട്എൻഡ് ഡൊമെയ്‌നിന് മാത്രം അനുമതി നൽകുന്നു
const allowedOrigins = ['https://restaurant-management-system-fronte-eight.vercel.app'];

app.use(cors({
  origin: function (origin, callback) {
    // റിക്വസ്റ്റ് വരുന്നത് അനുവദനീയമായ ഡൊമെയ്‌നുകളിൽ നിന്നോ 
    // അല്ലെങ്കിൽ ബ്രൗസറിൽ നിന്ന് origin ഇല്ലാത്ത റിക്വസ്റ്റോ (ഉദാഹരണത്തിന് Postman) ആണോ എന്ന് പരിശോധിക്കുന്നു
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true // Cookies/Session ID-കൾ അയക്കാൻ ഇത് ആവശ്യമാണ്
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
