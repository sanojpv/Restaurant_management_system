import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Customer from "../models/customer.js";

// Customer Registration
export const registerCustomer = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newCustomer = new Customer({ name, email, password: hashedPassword });
    await newCustomer.save();
    const token = jwt.sign({ id: newCustomer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({message:"registerCustomer successfully", token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Customer Login
export const loginCustomer = async (req, res) => {
  const { email, password } = req.body;
  try {
    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: customer._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({message:"loginCustomer successfully", token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Customer Profile
export const getCustomerProfile = async (req, res) => {
  try {

    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({message:"Profile fetched successfully", customer });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Update Customer Profile
export const updateCustomerProfile = async (req, res) => {
  const { name, email } = req.body;
  try {
    const updatedCustomer = await Customer.findByIdAndUpdate(req.params.id, { name, email }, { new: true });
    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json({ message: "Profile updated successfully", customer: updatedCustomer });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });  
  }
};

// Delete Customer Account
export const deleteCustomerAccount = async (req, res) => {
  try {
    await Customer.findByIdAndDelete(req.customer.id);
    res.status(200).json({ message: 'Customer account deleted successfully' , customer:req.customer.name});
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
