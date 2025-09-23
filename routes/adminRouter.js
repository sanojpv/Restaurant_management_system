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
router.get("/profile", protect, getAdminProfile);
router.put("/profile", protect, updateAdminProfile);

// Staff
router.get("/staff", protect, getAllStaff);
router.post("/staff", protect, createStaff);
router.get("/staff/:id", protect, getStaffById);
router.put("/staff/:id", protect, updateStaff);
router.delete("/staff/:id", protect, deleteStaff);

// Menu
router.get("/menu/:id", protect, getMenuItemById);

export default router;
