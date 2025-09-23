import express from 'express';
import { createOrder, deleteOrder, getOrderById, getOrders } from '../controllers/orderController.js';



const router=express.Router();
router.post('/',createOrder);
router.get('/',getOrders)
router.get('/:id',getOrderById)
router.delete('/:id',deleteOrder)

export default router;