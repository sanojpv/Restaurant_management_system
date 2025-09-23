import express  from 'express';
import dotenv from 'dotenv';
import connectDB from './config/databade.js';
import adminRoutes from './routes/adminRouter.js';
import staffRouter from './routes/staffRouter.js'
import customerRoutes from './routes/customerRouter.js'
import menuRoutes from './routes/menuRouter.js'
import orderRoutes from './routes/orderRouter.js'
import paymentRoutes from './routes/paymentRouter.js'
import reservationRoutes from './routes/reservation.js'
dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use('/api/admin', adminRoutes);
app.use('/api/staff',staffRouter)
app.use('/api/customer',customerRoutes)
app.use('/api/menu',menuRoutes)
app.use('/api/order',orderRoutes)
app.use('/api/payment',paymentRoutes)
app.use('/api/reservation',reservationRoutes)

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});