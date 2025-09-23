import express from 'express';
import { loginStaff, } from '../controllers/staffController.js';
import { protect, staffOnly } from '../middleware/authMiddleware.js';
const router = express.Router();


router.post('/login',protect,staffOnly,loginStaff)
export default router;