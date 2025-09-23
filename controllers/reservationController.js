import { Reservation } from "../models/reservation.js";
import Customer from "../models/customer.js";

// Create a new reservation
export const createReservation = async (req, res) => {
  const { customerId, date, time, partySize } = req.body;
  try {
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    const newReservation = new Reservation({ customerId, date, time, partySize });
    await newReservation.save();
    res.status(201).json({ message: 'Reservation created successfully', reservation: newReservation });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get reservations for a specific user
export const getUserReservation = async (req, res) => {
  const { customerId } = req.params;
  try {
    const reservations = await Reservation.findOne(customerId).populate('customerId', 'name email phone').populate("table");
    res.status(200).json({ reservations });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Get all reservations (admin)
export const getAllReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find().populate('customerId', 'name email phone');
    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
// Update a reservation

export const updateReservation = async (req, res) => {
  const { id } = req.params;
  const { date, time, partySize } = req.body;
  
  try {
    const reservation = await Reservation.findByIdAndUpdate(
      id,
      { date, time, partySize },
      { new: true, runValidators: true } // new = return updated doc, runValidators = re-check schema rules
    );
    
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    
    res.status(200).json({
      message: "Reservation updated successfully",
      reservation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Cancel a reservation
export const cancelReservation = async (req, res) => {
  const { id } = req.params;
  try {
    const reservation = await Reservation.findByIdAndDelete(id);
    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }
    res.status(200).json({ message: 'Reservation canceled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

