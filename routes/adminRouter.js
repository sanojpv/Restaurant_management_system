
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
  getMenuItemById,
  getAllCustomers,
  getAllMenuItems,
  registerAdmin
} from "../controllers/adminController.js";

import { adminOnly, protect } from "../middleware/authMiddleware.js";
import { createMenuItem } from "../controllers/menuController.js";
import upload from "../middleware/upload.js";   // <-- multer middleware

const router = express.Router();

// Admin
router.post("/register", registerAdmin);
router.post("/login", loginAdmin);
router.get("/profile", protect, adminOnly, getAdminProfile);
router.put("/profile", protect, adminOnly, updateAdminProfile);

// Staff
router.get("/staff", getAllStaff);
router.post("/staff", createStaff);
router.get("/staff/:id", protect, adminOnly, getStaffById);
router.put("/staff/:id", protect, adminOnly, updateStaff);
router.delete("/staff/:id", protect, adminOnly, deleteStaff);

// Customers
router.get("/customer", getAllCustomers);

// Menu
router.get("/", getAllMenuItems);
router.post("/menu/create", upload.single("image"), createMenuItem); // 👈 FIX
router.get("/menu/:id", protect, adminOnly, getMenuItemById);

export default router;
