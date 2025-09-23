import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer",
    required: true
  },
  items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "completed", "cancelled"],
    default: "pending"
  }
});

const Order = mongoose.model("Order", orderSchema);

export default Order;
