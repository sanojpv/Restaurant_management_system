
import express from "express";
import {
  staffLogin,
  getStaffProfile,
  updateStaffProfile,
  getNewOrders, 
  acceptOrder, 
  rejectOrder, 
  getPendingReservations, 
  acceptReservation,
  declineReservation, 
} from "../controllers/staffController.js";
import { protect, staffOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", staffLogin);
router.get("/profile/:id", protect, staffOnly, getStaffProfile);
router.put("/profile/:id", protect, staffOnly, updateStaffProfile);


router.get("/orders/new", protect, staffOnly, getNewOrders); 
router.put("/orders/:id/accept", protect, staffOnly, acceptOrder); 
router.put("/orders/:id/reject", protect, staffOnly, rejectOrder); 

// Reservations
router.get("/reservations/new", protect, staffOnly, getPendingReservations); 
router.put("/reservations/:id/accept", protect, staffOnly, acceptReservation); 
router.put("/reservations/:id/decline", protect, staffOnly, declineReservation); 

export default router;
