import Payment from "../models/payment.js";
import { Reservation } from "../models/reservation.js";
import Order from "../models/order.js";

// Create a new payment
export const createPayment = async (req, res) => {
  const { orderId, amount, method } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const payment = new Payment({
      customerId: order.customerId,
      orderId: order._id,
      amount,
      method
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all payments for a customer
export const getCustomerPayments = async (req, res) => {
  const { id } = req.query; // Assuming customerId is passed as a query parameter
  try {
    const payments = await Payment.find(id);
if(payments.length === 0){
  return res.status(404).json({message: "No Payments Found for this customer"})
}

    res.status(200).json(payments);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


// Get a single payment by ID
export const getPaymentById = async (req, res) => {
  const { id } = req.params;
  try {
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json({ payment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Update a payment
export const updatePayment = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  try {
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    payment.amount = amount;
    await payment.save();
    res.status(200).json({ payment });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

