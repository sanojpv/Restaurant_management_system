
import express from "express";
import {
  staffLogin,
  getStaffProfile,
  updateStaffProfile,
  getNewOrders,
  acceptOrder,
  rejectOrder,
  deliverOrder,
  cancelCodOrder,
  getPendingReservations,
  acceptReservation,
  declineReservation,
  getAllOrders,
} from "../controllers/staffController.js";
import { protect, staffOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth & profile
router.post("/login", staffLogin);
router.get("/profile", protect, staffOnly, getStaffProfile);
router.put("/profile", protect, staffOnly, updateStaffProfile);

// Orders
router.get("/orders/new", protect, staffOnly, getNewOrders);
router.put("/orders/:id/accept", protect, staffOnly, acceptOrder);
router.put("/orders/:id/reject", protect, staffOnly, rejectOrder);
router.put("/orders/:id/deliver", protect, staffOnly, deliverOrder);
router.put("/orders/:id/cancelCod", protect, staffOnly, cancelCodOrder);
router.get("/orders/all", protect, staffOnly, getAllOrders);

// Reservations
router.get("/reservations/new", protect, staffOnly, getPendingReservations);
router.put("/reservations/:id/accept", protect, staffOnly, acceptReservation);
router.put("/reservations/:id/decline", protect, staffOnly, declineReservation);

export default router;
