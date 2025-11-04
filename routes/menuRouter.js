
import express from 'express';
import { 
  createMenuItem, 
  deleteMenuItem, 
  getMenuItems, 
  updateMenuItem,
  getMenuItemById
} from '../controllers/menuController.js';

import upload from '../middleware/upload.js'; 

const router = express.Router();

router.get("/getmenu", getMenuItems);
router.get('/:id', getMenuItemById);

router.post('/', upload.single('image'), createMenuItem); 

router.put('/:id', upload.single('image'), updateMenuItem); 

router.delete('/:id', deleteMenuItem);

export default router;