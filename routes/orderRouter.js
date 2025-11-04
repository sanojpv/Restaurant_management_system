
import express from 'express';
import { 
    createOrder, 
    createRazorpayOrder, 
    getCustomerOrders, 
    getOrderById, 
    
    verifyRazorpayPayment,
    
} from '../controllers/orderController.js';

import { protect } from '../middleware/authMiddleware.js'; 

const router = express.Router();

router.post('/create-order', protect, createOrder); 
router.get('/view-orders',getOrderById); 
router.get('/my-orders', protect, getCustomerOrders);
router.post('/razorpay-order', protect, createRazorpayOrder);
router.post('/verify-payment', protect, verifyRazorpayPayment);


export default router;