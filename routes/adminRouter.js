
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
  getAllCustomers,
  registerAdmin,
  getDashboardStats,
} from "../controllers/adminController.js";

import { createMenuItem, deleteMenuItem, updateMenuItem } from "../controllers/menuController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

//  Admin Auth
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);

// Admin Profile
router.get("/profile", protect, adminOnly, getAdminProfile);
router.put("/profile/:id", updateAdminProfile);

//  Staff Management
router.get("/staff", protect, adminOnly, getAllStaff);
router.post("/staff", protect, adminOnly, createStaff);
router.get("/staff/:id", protect, adminOnly, getStaffById);
router.put("/staff/:id", protect, adminOnly, updateStaff);
router.delete("/staff/:id", protect, adminOnly, deleteStaff);

// Customers
router.get("/customer", protect, adminOnly, getAllCustomers);

//  Dashboard
router.get("/dashboard", protect, adminOnly, getDashboardStats);

//  Menu
router.post("/menu/create", protect, adminOnly, upload.single("image"), createMenuItem);
router.put('/:id', protect, adminOnly, updateMenuItem); 
router.delete('/:id', protect, adminOnly, deleteMenuItem);
export default router;
