
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "customer",
            required: true,
        },
        items: [
            {
                item: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Menu",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
     
        deliveryOption: {
            type: String,
            required: true,
            enum: ['pickup', 'Online delivery'],
        },
      
        status: {
            type: String,
            default: 'Pending',
            enum: ['Pending', 'Confirmed', 'Delivered', 'Cancelled'], 
        },
        paymentStatus: { 
            type: String,
            default: 'Awaiting Payment',
            enum: ['Pending', 'Awaiting Payment', 'Paid', 'Refunded'],
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ['cod', 'online'],
        },
        razorpayOrderId: {
            type: String,
            required: false,
        },
        razorpayPaymentId: {
            type: String,
            required: false,
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;