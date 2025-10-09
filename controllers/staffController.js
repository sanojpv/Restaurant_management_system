import Staff from "../models/staff.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



// =================== STAFF LOGIN ===================


export const staffLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const staff = await Staff.findOne({ email });
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: staff._id, role: "staff" },   // role save cheyyunnu
      process.env.JWT_SECRET,
      { expiresIn: "14d" }
    );
   localStorage.setItem("token",token)
    res.status(200).json({
      message: "Login successful",
      token,
      role: staff.role,   // staff role (waiter/chef/delivery etc.)
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        role: staff.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};









export const getStaffProfile = async (req, res) => {
  try {
    const staff = await Staff.findById(req.userId).select("-password");
    if (!staff) {
      return res.status(404).json({ message: "Staff not found" });
    }
    res.status(200).json({ staff });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
