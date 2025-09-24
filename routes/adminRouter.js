import express from "express";
import {
  loginAdmin,
  getAdminProfile,
  updateAdminProfile,
  getAllStaff,
  createStaff,
  getStaffById,
  updateStaff,
  deleteStaff,
  getMenuItemById
} from "../controllers/adminController.js";
import { adminOnly, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin
router.post("/login", loginAdmin);
router.get("/profile", protect,adminOnly, getAdminProfile);
router.put("/profile", protect,adminOnly, updateAdminProfile);

// Staff
router.get("/staff", protect,adminOnly, getAllStaff);
router.post("/staff", protect,adminOnly, createStaff);
router.get("/staff/:id", protect,adminOnly, getStaffById);
router.put("/staff/:id", protect,adminOnly, updateStaff);
router.delete("/staff/:id", protect,adminOnly, deleteStaff);

// Menu
router.get("/menu/:id", protect,adminOnly, getMenuItemById);

export default router;
