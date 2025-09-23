import bcrypt from 'bcryptjs';
import Admin from '../models/admin.js';
import jwt from 'jsonwebtoken';
import Staff from '../models/staff.js';
import Menu from '../models/menu.js';

// Admin Login
export const loginAdmin = async (req, res) => {
  const { email,password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
  
    
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials & admin not found' });
    }
    const isMatch = bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials & password mismatch' });
    }
   
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '14d' });
   return res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Get Admin Profile
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json({ admin });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Update Admin Profile
export const updateAdminProfile = async (req, res) => {
  const { name, email } = req.body;
    try {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.admin.id, { name, email }, { new: true });
    if (!updatedAdmin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
    res.status(200).json({ admin: updatedAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Get all staff members
export const getAllStaff = async (req, res) => {
  try {
    const staffMembers = await Staff.find();
    res.status(200).json({ staff: staffMembers });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};  
// Delete a staff member
export const deleteStaff = async (req, res) => {
  const { id } = req.params;
    try {
    const deletedStaff = await Staff.findByIdAndDelete(id);
    if (!deletedStaff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.status(200).json({ message: 'Staff member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Get a single staff member by ID
export const getStaffById = async (req, res) => {
  const { id } = req.params;
    try {
    const staff = await Staff.findById(id);
    if
    (!staff) {
        return res.status(404).json({ message: 'Staff member not found' });
    }
    res.status(200).json({ staff });
    } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Update a staff member
export const updateStaff = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
    try {
    const updatedStaff = await Staff.findByIdAndUpdate(id, { name, email }, { new: true });
    if (!updatedStaff) {
      return res.status(404).json({ message: 'Staff member not found' });
    }
    res.status(200).json({ staff: updatedStaff });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Create a new staff member
export const createStaff = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingStaff = await Staff.findOne({ email });
    if (existingStaff) {
      return res.status(400).json({ message: 'Staff member already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newStaff = new Staff({ name, email, password: hashedPassword });
    await newStaff.save();
    res.status(201).json({ staff: newStaff });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
 
// Get a single menu item by ID
export const getMenuItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const menuItem = await Menu.findById(id);
    if (!menuItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json({ menuItem });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
 



