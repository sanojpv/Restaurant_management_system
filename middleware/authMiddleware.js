import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
import Staff from "../models/staff.js";
import Customer from "../models/customer.js";

// Common protect middleware (check token & decode)
export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Expected format: Bearer <token>
  
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // store id for later use
   
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Admin only
export const adminOnly = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password");
    if (!admin) return res.status(403).json({ message: "Access denied" });
    req.admin = admin;
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Staff only
export const staffOnly = async (req, res, next) => {
  try {
    const staff = await Staff.findById(req.userId).select("-password");
    if (!staff) return res.status(403).json({ message: "Access denied" });
    req.staff = staff;
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Customer only
export const customerOnly = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.userId).select("-password");
    if (!customer) return res.status(403).json({ message: "Access denied" });
    req.customer = customer;
    next();
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
