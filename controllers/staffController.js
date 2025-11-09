import Staff from "../models/staff.js";
import Order from "../models/order.js";
import { Reservation } from "../models/reservation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const staffLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const staff = await Staff.findOne({ email });
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = jwt.sign(
      { id: staff._id, role: "staff" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        position: staff.position,
        role: "staff",
      },
    });
  } catch (error) {
    console.error("staffLogin error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getStaffProfile = async (req, res) => {
  try {
    const staff = await Staff.findById(req.userId).select("-password");
    console.log(staff);

    if (!staff) return res.status(404).json({ message: "Staff not found" });

    res.json(staff);
  } catch (error) {
    console.error("getStaffProfile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateStaffProfile = async (req, res) => {
  try {
    const staff = await Staff.findById(req.userId);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const { name, email, password, position } = req.body;

    if (name) staff.name = name;
    if (email) staff.email = email;
    if (typeof position !== "undefined") staff.position = position;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      staff.password = await bcrypt.hash(password, salt);
    }

    await staff.save();

    res.json({
      message: "Profile updated successfully",
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        position: staff.position,
        role: "staff",
      },
    });
  } catch (error) {
    console.error("updateStaffProfile error:", error);
    res.status(500).json({ message: "Server error during update" });
  }
};

// Fetch all pending orders
export const getNewOrders = async (req, res) => {
  try {
    const newOrders = await Order.find({ status: "Pending" }).sort({
      createdAt: 1,
    });
    res.status(200).json({ orders: newOrders });
  } catch (error) {
    console.error("getNewOrders error:", error);
    res.status(500).json({ message: "Server error fetching orders." });
  }
};

//Fetch all COD orders (where paymentMethod is 'cod')
export const getCodOrders = async (req, res) => {
  try {
    // Fetch orders that are Confirmed/Accepted but not yet Delivered or Cancelled
    const codOrders = await Order.find({
      paymentMethod: "cod",
      status: { $nin: ["Delivered", "Cancelled"] },
    }).sort({ createdAt: -1 }); // Show newest first

    res.status(200).json({ orders: codOrders });
  } catch (error) {
    console.error("getCodOrders error:", error);
    res.status(500).json({ message: "Server error fetching COD orders." });
  }
};

//Accept order (Initial acceptance for new orders)
export const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Confirmed" },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json({ message: "Order confirmed successfully.", order });
  } catch (error) {
    console.error("acceptOrder error:", error);
    res.status(500).json({ message: "Server error confirming order." });
  }
};

// Reject order (Initial rejection for new orders)
export const rejectOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json({
      message: "Order rejected (marked cancelled) successfully.",
      order,
    });
  } catch (error) {
    console.error("rejectOrder error:", error);
    res.status(500).json({ message: "Server error rejecting order." });
  }
};

//Controller to mark an order as Delivered (for COD/Delivery staff)
export const deliverOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Delivered", paymentStatus: "Paid" }, // Set final status and payment status
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json({ message: "Order marked as delivered successfully.", order });
  } catch (error) {
    console.error("deliverOrder error:", error);
    res
      .status(500)
      .json({ message: "Server error marking order as delivered." });
  }
};

//Controller to mark a COD order as Cancelled (on-the-spot cancellation)
export const cancelCodOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json({ message: "Order cancelled successfully.", order });
  } catch (error) {
    console.error("cancelCodOrder error:", error);
    res.status(500).json({ message: "Server error cancelling order." });
  }
};

// Fetch all pending reservations
export const getPendingReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ status: "pending" }).sort({
      date: 1,
      time: 1,
    });
    res.status(200).json({ reservations });
  } catch (error) {
    console.error("getPendingReservations error:", error);
    res.status(500).json({ message: "Server error fetching reservations." });
  }
};

// reservation status to Accepted
export const acceptReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: "confirmed" },
      { new: true }
    );
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found." });
    res.json({ message: "Reservation confirmed successfully.", reservation });
  } catch (error) {
    console.error("acceptReservation error:", error);
    res.status(500).json({ message: "Server error confirming reservation." });
  }
};

export const declineReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found." });
    res.json({
      message: "Reservation declined (marked cancelled) successfully.",
      reservation,
    });
  } catch (error) {
    console.error("declineReservation error:", error);
    res.status(500).json({ message: "Server error declining reservation." });
  }
};
