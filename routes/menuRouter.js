import express from 'express';
import { createMenuItem, deleteMenuItem, getMenuItems, updateMenuItem } from '../controllers/menuController.js';
import { getMenuItemById } from '../controllers/adminController.js';

const router=express.Router()

router.get('/getmenu',getMenuItems)
router.get('/:id',getMenuItemById)
router.post('/',createMenuItem);
router.put('/:id',updateMenuItem)
router.delete('/:id',deleteMenuItem)




export default router;
