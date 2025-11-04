

import express from "express";
import {
  registerCustomer,
  loginCustomer,
  getCustomerProfile,
  updateCustomerProfile,
  updateCustomerPassword,
  deleteCustomerAccount,
} from "../controllers/customerController.js";
import { protectCustomer } from "../middleware/authMiddleware.js";
import { addToCart, getCart } from "../controllers/cartController.js";

const router = express.Router();

// Auth Routes
router.post("/signup", registerCustomer);
router.post("/login", loginCustomer);

// Cart Routes (requires customer login)
router.post("/cart/add", protectCustomer, addToCart);
router.get("/cart", protectCustomer, getCart);

// Profile Routes
router.get("/profile", protectCustomer, getCustomerProfile);
router.patch("/profile", protectCustomer, updateCustomerProfile);
router.put("/profile/password", protectCustomer, updateCustomerPassword);
router.delete("/profile", protectCustomer, deleteCustomerAccount);

export default router;


