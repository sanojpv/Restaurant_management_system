import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    reservationId: { type: mongoose.Schema.Types.ObjectId, ref: "Reservation", required: true },
    amount: { type: Number, required: true },
    method: { type: String, enum: ["credit_card", "debit_card", "paypal"], required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;