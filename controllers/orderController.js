import Order from "../models/order.js";
import Customer from "../models/customer.js";
import Menu from "../models/menu.js";

// Create a new order  
export const createOrder = async (req, res) => {
  const { customerId, items, totalAmount } = req.body;
  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    const newOrder = new Order({ customerId, items, totalAmount });
    await newOrder.save();
    res.status(201).json({ message: 'Order created successfully', order: newOrder });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Get all orders
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('customerId', 'name email')
    .populate('items.item', 'name price');
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Get a single order by ID
export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id).populate('customerId', 'name email');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
//delete order
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