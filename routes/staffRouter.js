import express from 'express';
import { getStaffProfile, staffLogin, } from '../controllers/staffController.js';
import { protect, staffOnly } from '../middleware/authMiddleware.js';
const router = express.Router();


router.post('/login',staffLogin)
router.get('/profile',protect,staffOnly,getStaffProfile)
export default router;