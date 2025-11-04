

import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
import Staff from "../models/staff.js";
import Customer from "../models/customer.js";

// Common JWT check
export const protect = async (req, res, next) => {
 try {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
   return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (!decoded?.id) {
   return res.status(401).json({ message: "Invalid token payload" });
  }

  let user = null;
  if (decoded.role === "admin") {
   user = await Admin.findById(decoded.id).select("-password");
  } else if (decoded.role === "staff") {
   user = await Staff.findById(decoded.id).select("-password");
  } else if (decoded.role === "customer") {
   user = await Customer.findById(decoded.id).select("-password");
  }

  if (!user) return res.status(401).json({ message: "User not found" });

  req.user = user;
  req.userId = decoded.id;
  req.userRole = decoded.role;
  next();
 } catch (err) {
  console.error("protect error:", err);
  res.status(401).json({ message: "Not authorized, token failed" });
 }
};


export const protectCustomer = async (req, res, next) => {
 try {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const customer = await Customer.findById(decoded.id).select("-password");

  if (!customer)
   return res.status(403).json({ message: "Access denied — Customers only" });

  req.customer = customer;
  req.userId = decoded.id;
  req.userRole = "customer";
  next();
 } catch (err) {
  console.error("protectCustomer error:", err);
  res.status(401).json({ message: "Invalid or expired token" });
 }
};

export const adminOnly = (req, res, next) => {
 if (req.userRole === "admin") return next();
 return res.status(403).json({ message: "Access denied — Admin only" });
};

export const staffOnly = (req, res, next) => {
 if (req.userRole === "staff") return next();
 return res.status(403).json({ message: "Access denied — Staff only" });
};

export const customerOnly = (req, res, next) => {
 if (req.userRole === "customer") return next();
 return res.status(403).json({ message: "Access denied — Customer only" });
};