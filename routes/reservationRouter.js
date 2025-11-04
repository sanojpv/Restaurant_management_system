
import express from "express";
import {
  createReservation,
  getUserReservation,
  getAllReservations,
  updateReservation,
  cancelReservation,
} from "../controllers/reservationController.js";
import { protect, protectCustomer } from "../middleware/authMiddleware.js";

const router = express.Router();

// Customer routes (authenticated)
router.post("/create", protect, protectCustomer, createReservation);

// Preferred safe endpoint — uses token to identify customer
router.get("/customer/me", protect, protectCustomer, getUserReservation);


// Admin/all routes - protected
router.get("/", protect, getAllReservations);
router.put("/:id", protect, updateReservation);
router.delete("/:id", protect, cancelReservation);

export default router;
