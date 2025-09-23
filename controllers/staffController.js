import Staff from "../models/staff.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";



//Staff Login
export const loginStaff = async (req, res) => {
  const { email, password } = req.body;
  try {
    const staff = await Staff.findOne({ email });
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    res.status(200).json({message:"login success"})
    // const token = jwt.sign({ id: staff._id }, process.env.JWT_SECRET, { expiresIn: '14d' });
    // res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Get Staff Profile
export const getStaffProfile = async (req, res) => {
  try {
    const staff = await Staff.findById(req.staffId);
    if (!staff) {
      return res.status(404).json({ message: 'Staff not found' });
    }
    res.status(200).json({ staff });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

