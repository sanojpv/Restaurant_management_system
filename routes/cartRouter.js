import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
  updateCartQuantity,
} from "../controllers/cartController.js";
import { protect, customerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// All cart routes require a token and must be initiated by a customer
router.post("/add", protect, customerOnly, addToCart);
router.get("/view", protect, customerOnly, getCart);
//Added both 'protect' and 'customerOnly'
router.put("/update", protect, customerOnly, updateCartQuantity);
router.delete("/:menuItemId", protect, customerOnly, removeFromCart);

export default router;
