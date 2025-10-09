
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/admin.js";
import Staff from "../models/staff.js";
import Customer from "../models/customer.js";

// Role-based login
export const login = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    let user;

    // Role check & find user
    if (role === "admin") {
      user = await Admin.findOne({ email });
    } else if (role === "staff") {
      user = await Staff.findOne({ email });
    } else if (role === "customer") {
      user = await Customer.findOne({ email });
    } else {
      return res.status(400).json({ message: "Invalid role selected" });
    }

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Password check
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    // JWT token
    const token = jwt.sign(
      { id: user._id, role: role },
      process.env.JWT_SECRET,
      { expiresIn: "14d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      role,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
