import Staff from "../models/staff.js";
import Order from "../models/order.js";
import { Reservation } from "../models/reservation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Staff login
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

// Get staff profile
export const getStaffProfile = async (req, res) => {
  try {
    const staff = await Staff.findById(req.userId).select("-password");
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json(staff);
  } catch (error) {
    console.error("getStaffProfile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update staff profile
export const updateStaffProfile = async (req, res) => {
  try {
    const staff = await Staff.findById(req.userId);
    if (!staff) return res.status(404).json({ message: "Staff not found" });

    const { name, email, password, position } = req.body;
    if (name) staff.name = name;
    if (email) staff.email = email;
    if (position !== undefined) staff.position = position;
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
    const newOrders = await Order.find({
      status: { $in: ["Pending", "Confirmed"] },
    })
      .sort({ createdAt: 1 })
      .populate("customerId", "name email")
      .populate("items.item", "name");

    res.status(200).json({ orders: newOrders });
  } catch (error) {
    console.error("getNewOrders error:", error);
    res.status(500).json({ message: "Server error fetching orders." });
  }
};

// Accept order
export const acceptOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found." });

    let update = {};
    if (order.paymentMethod === "cod") {
      update = { status: "Confirmed", paymentStatus: "Awaiting Payment" };
    } else {
      update = { status: "Confirmed", paymentStatus: "Paid" };
    }

    const updated = await Order.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });
    res.json({ message: "Order confirmed successfully.", order: updated });
  } catch (error) {
    console.error("acceptOrder error:", error);
    res.status(500).json({ message: "Server error confirming order." });
  }
};

// Reject order
export const rejectOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json({ message: "Order rejected successfully.", order });
  } catch (error) {
    console.error("rejectOrder error:", error);
    res.status(500).json({ message: "Server error rejecting order." });
  }
};

// Deliver order
export const deliverOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: "Delivered", paymentStatus: "Paid" },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found." });
    res.json({ message: "Order delivered successfully.", order });
  } catch (error) {
    console.error("deliverOrder error:", error);
    res.status(500).json({ message: "Server error delivering order." });
  }
};

// Cancel COD order
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

// Pending reservations

export const getPendingReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ status: "pending" }).sort({
      date: 1,
      time: 1,
    });

    // Combine date + time → single ISO string (reservationTime)
    const formatted = reservations.map((r) => {
      let dateTime = null;

      if (r.date && r.time) {
        const datePart = new Date(r.date);
        // Combine into a full ISO datetime string
        const [hours, minutes] = r.time.split(":");
        datePart.setHours(Number(hours), Number(minutes), 0, 0);
        dateTime = datePart;
      }

      return {
        _id: r._id,
        name: r.name,
        email: r.email,
        partySize: r.partySize,
        status: r.status,
        reservationTime: dateTime,
      };
    });

    res.status(200).json({ reservations: formatted });
  } catch (error) {
    console.error("getPendingReservations error:", error);
    res.status(500).json({ message: "Server error fetching reservations." });
  }
};

// Accept reservation
export const acceptReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: "confirmed" },
      { new: true }
    );
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found." });
    res.json({ message: "Reservation confirmed.", reservation });
  } catch (error) {
    console.error("acceptReservation error:", error);
    res.status(500).json({ message: "Server error confirming reservation." });
  }
};

// Decline reservation
export const declineReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { status: "cancelled" },
      { new: true }
    );
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found." });
    res.json({ message: "Reservation declined.", reservation });
  } catch (error) {
    console.error("declineReservation error:", error);
    res.status(500).json({ message: "Server error declining reservation." });
  }
};

// All orders
export const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate("customerId", "name email")
      .populate("items.item", "name");
    res.status(200).json({ orders: allOrders });
  } catch (error) {
    console.error("getAllOrders error:", error);
    res.status(500).json({ message: "Server error fetching all orders." });
  }
};
