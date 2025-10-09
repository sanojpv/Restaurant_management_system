// import express  from 'express';
// import dotenv from 'dotenv';
// import cors from 'cors'
// import connectDB from './config/databade.js';
// import adminRoutes from './routes/adminRouter.js';
// import staffRouter from './routes/staffRouter.js'
// import customerRoutes from './routes/customerRouter.js'
// import menuRoutes from './routes/menuRouter.js'
// import orderRoutes from './routes/orderRouter.js'
// import paymentRoutes from './routes/paymentRouter.js'
// import reservationRoutes from './routes/reservation.js'
// import authRouter from './routes/authRoutes.js'

// dotenv.config();
// connectDB();

// const app = express();
// app.use(cors())
// app.use(express.json());
// app.use('/api/admin', adminRoutes);
// app.use('/api/staff',staffRouter)
// app.use('/api/customer',customerRoutes)
// app.use('/api/auth',authRouter)
// app.use('/api/menu',menuRoutes)
// app.use('/api/order',orderRoutes)
// app.use('/api/payment',paymentRoutes)
// app.use('/api/reservation',reservationRoutes)
// app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });


import express  from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import connectDB from './config/databade.js';
import adminRoutes from './routes/adminRouter.js';
import staffRouter from './routes/staffRouter.js';
import customerRoutes from './routes/customerRouter.js';
import menuRoutes from './routes/menuRouter.js';
import orderRoutes from './routes/orderRouter.js';
import paymentRoutes from './routes/paymentRouter.js';
import reservationRoutes from './routes/reservation.js';
import authRouter from './routes/authRoutes.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(process.cwd(), "uploads"))); // 👈 add path import

app.use('/api/admin', adminRoutes);
app.use('/api/staff', staffRouter);
app.use('/api/customer', customerRoutes);
app.use('/api/auth', authRouter);
app.use('/api/menu', menuRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/reservation', reservationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
