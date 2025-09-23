import express from "express";
import {
  createPayment,
  getCustomerPayments,
  getPaymentById,
  updatePayment,
} from "../controllers/paymentController.js";

const router = express.Router();

router.post("/", createPayment);
router.get("/", getCustomerPayments);

router.get("/:id", getPaymentById);
router.patch("/:id", updatePayment);

export default router;
