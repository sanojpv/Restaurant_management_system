

import Order from "../models/order.js";
import Customer from "../models/customer.js";
import Cart from "../models/cart.js"; 

import dotenv from 'dotenv';
dotenv.config();

import Razorpay from 'razorpay';
import crypto from 'crypto';

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  const customerId = req.user?._id; 
  const { items, totalAmount, paymentMethod, deliveryOption } = req.body; 
  
  if (!customerId) {
    return res.status(401).json({ message: 'Authentication required. Customer ID missing.' });
  }
  
  if (!items || items.length === 0 || !totalAmount || !deliveryOption) {
    return res.status(400).json({ message: 'Required order details (items, amount, or delivery option) are missing.' });
  }

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

        let modelDeliveryOption = deliveryOption;
        if (deliveryOption && deliveryOption.toLowerCase() === 'delivery') {
            modelDeliveryOption = 'Online delivery';
        }

    const newOrder = new Order({ 
      customerId, 
      items: items.map(cartItem => ({ 
        item: cartItem.item, 
        quantity: cartItem.quantity 
      })),
      totalAmount,
      deliveryOption: modelDeliveryOption, 
      status: 'Pending',
      paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Awaiting Payment',
      paymentMethod: paymentMethod
    });
    
    await newOrder.save();

    // Cart Cleanup Logic 
    if (Cart) {
      await Cart.findOneAndDelete({ customerId: customerId }); 
    }

    res.status(201).json({ 
      message: 'Order created successfully', 
      order: newOrder 
    });
  } catch (error) {
    console.error("Error creating order:", error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: `Validation failed: ${error.message}`, 
        details: error.errors 
      });
    }
    
    res.status(500).json({ message: 'Server error during order creation' });
  }
};

// --- Create Razorpay Order ID ---
export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    
    const internalOrder = await Order.findById(orderId);
    if (!internalOrder || internalOrder.totalAmount !== amount) {
       return res.status(400).json({ message: 'Order mismatch or not found' });
    }
    
    const options = {
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `order_rcptid_${orderId}`,
      notes: {
        internal_order_id: orderId
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);
    
    internalOrder.razorpayOrderId = razorpayOrder.id;
    await internalOrder.save();

    res.json(razorpayOrder);
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    res.status(500).json({ message: "Server error during Razorpay order creation" });
  }
};

// --- Verify Payment Signature ---
export const verifyRazorpayPayment = async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = shasum.digest('hex');

  if (digest !== razorpay_signature) {
    return res.status(400).json({ success: false, message: 'Invalid signature' });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Internal Order not found' });
    }

    order.paymentStatus = 'Paid';
    order.status = 'Confirmed';
    order.razorpayPaymentId = razorpay_payment_id;
    await order.save();
    
    res.json({ success: true, message: 'Payment verified and order updated' });
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ success: false, message: 'Server error during payment verification' });
  }
};

// --- Get Orders (Populated to show item details) ---
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customerId', 'name email')
    .populate('items.item', 'name price');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id).populate('customerId', 'name email')
    .populate('items.item', 'name price'); 
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};


export const getCustomerOrders = async (req, res) => {
  const customerId = req.user?._id; 
  
  if (!customerId) {
    return res.status(401).json({ message: 'Authentication required. Please log in.' });
  }
  
  try {
    
    const orders = await Order.find({ customerId: customerId })
      .populate('items.item', 'name price image')
      .sort({ createdAt: -1 }); 
    if (!orders || orders.length === 0) {
      return res.status(200).json({ message: 'No past orders found for this customer.', orders: [] });
    }
    
    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    res.status(500).json({ message: 'Server error during order history retrieval' });
  }
};
