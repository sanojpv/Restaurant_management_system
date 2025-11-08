import { Reservation } from "../models/reservation.js";
import Customer from "../models/customer.js";

// Create a new reservation
export const createReservation = async (req, res) => {
  try {
    const { date, time, partySize } = req.body;
    const customerId = req.customer?._id || req.userId;

    if (!customerId) {
      return res.status(401).json({ message: "Unauthorized: Login required" });
    }

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const { name, email } = customer;

    const reservationDate = date ? new Date(date) : null;

    // simple conflict check - same datetime
    const existing = await Reservation.findOne({
      date: reservationDate,
      time,
      customerId,
    });
    if (existing) {
      return res.status(400).json({
        message: "You already have a reservation at this date/time.",
      });
    }

    const newReservation = new Reservation({
      customerId,
      name,
      email,
      date: reservationDate,
      time,
      partySize,
      status: "pending",
    });

    await newReservation.save();
    res.status(201).json({
      message: "Reservation created successfully",
      reservation: newReservation,
    });
  } catch (error) {
    console.error("Reservation Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get reservations for the currently authenticated customer
export const getUserReservation = async (req, res) => {
  try {
    const customerId = req.customer?._id || req.userId;
    if (!customerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const reservations = await Reservation.find({ customerId })
      .sort({ date: 1, time: 1 })
      .lean();

    res.status(200).json({ reservations });
  } catch (err) {
    console.error("getUserReservation error:", err);
    res
      .status(500)
      .json({ message: "Failed to fetch reservations", error: err.message });
  }
};

// Admin: Get all reservations
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find()
      .populate("customerId", "name email")
      .lean();
    res.status(200).json({ reservations });
  } catch (error) {
    console.error("getAllReservations error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update reservation
export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, partySize, status } = req.body;

    const payload = {};
    if (date) payload.date = new Date(date);
    if (time) payload.time = time;
    if (partySize) payload.partySize = partySize;
    if (status) payload.status = status;

    const updated = await Reservation.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    if (!updated)
      return res.status(404).json({ message: "Reservation not found" });

    res
      .status(200)
      .json({ message: "Updated successfully", reservation: updated });
  } catch (error) {
    console.error("updateReservation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Cancel reservation (customer can delete their own reservation)
export const cancelReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });

    const customerId = req.customer?._id?.toString() || req.userId;
    if (reservation.customerId.toString() !== customerId) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this reservation" });
    }

    await Reservation.findByIdAndDelete(id);
    res.status(200).json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    console.error("cancelReservation error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
