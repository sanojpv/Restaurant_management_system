

import bcrypt from "bcryptjs";
import Admin from "../models/admin.js";
import jwt from "jsonwebtoken";
import Staff from "../models/staff.js";
import Menu from "../models/menu.js";
import Customer from "../models/customer.js";
import Order from "../models/order.js";

//admin register
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
//admin login
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


//  Get Dashboard Stats for Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: "pending" });
    const totalMenuItems = await Menu.countDocuments();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const todayOrders = await Order.find({
      createdAt: { $gte: today, $lt: tomorrow },
    });

    const revenueToday = todayOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    const recentOrders = await Order.find()
      .populate("customerId", "name")
      .sort({ _id: -1 })
      .limit(5);

    res.status(200).json({
      totalOrders,
      pendingOrders,
      totalMenuItems,
      revenueToday,
      recentOrders,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Error fetching dashboard stats" });
  }
};

export const createStaff = async (req, res) => {
  try {
    const { name, email, password, role, position } = req.body;

    //  Validate input
    if (!name || !email || !password || !role || !position) {
      return res.status(400).json({ message: "All fields are required" });
    }

    //  Check existing email
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ message: "Staff already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Create new staff record
    const newStaff = new Staff({
      name,
      email,
      password: hashedPassword,
      position: position, // e.g., 'waiter', 'chef'
      role, // now saves waiter, chef, etc.
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

// Get all staff members
export const getAllStaff = async (req, res) => {
  try {
    const staffMembers = await Staff.find();
    res.status(200).json({ staff: staffMembers });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a staff member
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

// Get a single staff member by ID
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

// Update a staff member
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

// Get a single menu item by ID
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

// Create Menu Item Controller
export const createMenuItem = async (req, res) => {
  try {
    // multer puts text fields in req.body and file in req.file
    const { name, description, price, category } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!name || !description || !price || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);

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

    // Group by category
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

//get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();

    //  Check if any customers were found
    if (!customers || customers.length === 0) {
      return res.status(404).json({
        message: "No customers found.",
      });
    }

    //  Send a success response with the customer data
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

