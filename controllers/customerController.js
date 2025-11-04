



import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Customer from "../models/customer.js";

// Helper to sign JWT
const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });

// Register a new customer
export const registerCustomer = async (req, res) => {
  const { name, email, phone, password } = req.body;
  try {
    const existing = await Customer.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Customer already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const c = await Customer.create({ name, email, phone, password: hashed });

    const token = signToken(c._id, "customer");
    res.status(201).json({
      message: "Registered successfully",
      token,
      customer: {
        _id: c._id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        role: "customer",
      },
    });
  } catch (err) {
    console.error("registerCustomer:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Login customer
export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await Customer.findOne({ email });
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    const ok = await bcrypt.compare(password, customer.password);
    if (!ok) return res.status(400).json({ message: "Invalid password" });

    const token = signToken(customer._id, "customer");

    res.json({
      message: "Login successful",
      token,
      customer: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        role: "customer",
      },
    });
  } catch (err) {
    console.error("loginCustomer error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get profile
export const getCustomerProfile = async (req, res) => {
  try {
    const customer = req.customer;
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    res.json({ customer });
  } catch (err) {
    console.error("getCustomerProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update profile (name, email, phone)
export const updateCustomerProfile = async (req, res) => {
  try {
    const id = req.customer?._id;
    if (!id) return res.status(400).json({ message: "Missing customer id" });

    const customer = await Customer.findById(id);
    if (!customer)
      return res.status(404).json({ message: "Customer not found" });

    const { name, email, phone } = req.body;
    if (name !== undefined) customer.name = name;
    if (email !== undefined) customer.email = email;
    if (phone !== undefined) customer.phone = phone;

    const updated = await customer.save();

    res.json({
      message: "Profile updated successfully",
      customer: {
        _id: updated._id,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        role: "customer",
      },
    });
  } catch (err) {
    console.error("updateCustomerProfile:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//  Update password
export const updateCustomerPassword = async (req, res) => {
  try {
    const id = req.customer?._id;
    if (!id) return res.status(400).json({ message: "Missing customer id" });

    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await Customer.findByIdAndUpdate(id, { password: hashed });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("updateCustomerPassword:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//  Delete account
export const deleteCustomerAccount = async (req, res) => {
  try {
    const id = req.customer?._id;
    if (!id) return res.status(400).json({ message: "Missing customer id" });

    const deleted = await Customer.findByIdAndDelete(id);
    if (!deleted)
      return res.status(404).json({ message: "Customer not found" });

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error("deleteCustomerAccount:", err);
    res.status(500).json({ message: "Server error" });
  }
};
