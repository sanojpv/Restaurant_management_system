import bcrypt from "bcryptjs";
import Admin from "../models/admin.js";
import jwt from "jsonwebtoken";
import Staff from "../models/staff.js";
import Menu from "../models/menu.js";
import Customer from "../models/customer.js";
import Order from "../models/order.js";

// Admin Register
export const registerAdmin = async (req, res) => {
  const { name, email, role, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({ name, email, role, password: hashedPassword });
    await admin.save();
    res.status(201).json({ Admin: admin });
  } catch (error) {
    res.status(500).json({ message: "admin reg error", error });
  }
};

// Admin Login
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "14d" }
    );

    res.status(200).json({ token, role: "admin", admin });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.userId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update Admin Profile
export const updateAdminProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.email,
      { name, email },
      { new: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Admin profile updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Dashboard Stats
export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "Pending" });
    const totalMenuItems = await Menu.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // Include both Confirmed and Delivered orders for revenue
    const todayOrders = await Order.find({
      status: { $in: ["Confirmed", "Delivered"] },
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const revenueToday = todayOrders.reduce(
      (sum, order) => sum + (order.totalAmount || order.totalPrice || 0),
      0
    );

    // Monthly Revenue
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);

    const monthOrders = await Order.find({
      status: { $in: ["Confirmed", "Delivered"] },
      createdAt: { $gte: startOfMonth, $lt: startOfNextMonth },
    });

    const revenueMonth = monthOrders.reduce(
      (sum, order) => sum + (order.totalAmount || order.totalPrice || 0),
      0
    );

    // Total Revenue (All Time)
    const allOrders = await Order.find({
      status: { $in: ["Confirmed", "Delivered"] },
    });
    const totalRevenue = allOrders.reduce(
      (sum, order) => sum + (order.totalAmount || order.totalPrice || 0),
      0
    );

    // Recent Orders
    const recentOrders = await Order.find()
      .populate({
        path: "customerId",
        select: "name",
      })
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      totalOrders,
      pendingOrders,
      totalMenuItems,
      revenueToday,
      revenueMonth,
      totalRevenue,
      recentOrders,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};

// Create Staff
export const createStaff = async (req, res) => {
  try {
    const { name, email, password, role, position } = req.body;

    if (!name || !email || !password || !role || !position) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ message: "Staff already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newStaff = new Staff({
      name,
      email,
      password: hashedPassword,
      position,
      role,
      userRole: "staff",
    });

    await newStaff.save();

    res.status(201).json({
      message: "Staff created successfully",
      staff: {
        id: newStaff._id,
        name: newStaff.name,
        email: newStaff.email,
        role: newStaff.role,
      },
    });
  } catch (error) {
    console.error("Error creating staff:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all staff
export const getAllStaff = async (req, res) => {
  try {
    const staffMembers = await Staff.find();
    res.status(200).json({ staff: staffMembers });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete staff
export const deleteStaff = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedStaff = await Staff.findByIdAndDelete(id);
    if (!deletedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(200).json({ message: "Staff member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get single staff
export const getStaffById = async (req, res) => {
  const { id } = req.params;
  try {
    const staff = await Staff.findById(id);
    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(200).json({ staff });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update staff
export const updateStaff = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(
      id,
      { name, email },
      { new: true }
    );
    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(200).json({
      message: "Staff member updated successfully",
      staff: updatedStaff,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get menu item by ID
export const getMenuItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const menuItem = await Menu.findById(id);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }
    res.status(200).json({ menuItem });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create menu item
export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const menuItem = await Menu.create({
      name,
      description,
      price,
      category,
      image,
    });

    res.status(201).json(menuItem);
  } catch (error) {
    console.error("Error creating menu item:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all menu items grouped by category
export const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await Menu.find();

    const grouped = menuItems.reduce((acc, item) => {
      const cat = item.category || "Others";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(item);
      return acc;
    }, {});

    res.status(200).json(grouped);
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();

    if (!customers || customers.length === 0) {
      return res.status(404).json({
        message: "No customers found.",
      });
    }

    res.status(200).json({
      count: customers.length,
      customers: customers,
    });
  } catch (error) {
    console.error("Error fetching all customers for admin:", error.message);
    res.status(500).json({
      message: "Server error while retrieving customers.",
      error: error.message,
    });
  }
};
