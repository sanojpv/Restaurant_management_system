import express from 'express';
import { customerOnly, protect } from '../middleware/authMiddleware.js';
import { registerCustomer,loginCustomer,getCustomerProfile,updateCustomerProfile, deleteCustomerAccount, } from '../controllers/customerController.js';
const router = express.Router();

router.post('/',registerCustomer)
router.post('/login',protect,customerOnly,loginCustomer)
router.get('/profile/:id',getCustomerProfile)
router.patch('/profile/:id',updateCustomerProfile)
router.delete('/profile',protect,customerOnly,deleteCustomerAccount)

export default router;