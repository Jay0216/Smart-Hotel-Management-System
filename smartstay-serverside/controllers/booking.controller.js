import { createBooking, BookingModel } from '../models/booking.model.js';

export const addBooking = async (req, res) => {
  try {
    const {
      room_id,
      branch_name,
      first_name,
      last_name,
      email,
      contact,
      id_number,
      guests,
      nights,
      additional_note,
      guest_id
    } = req.body;

    // Validate required fields
    if (
      !guest_id ||
      !room_id ||
      !branch_name ||
      !first_name ||
      !last_name ||
      !email ||
      !contact ||
      !guests ||
      !nights
    ) {
      return res.status(400).json({ message: 'All required booking fields must be provided, including guest_id' });
    }

    if (guests <= 0 || nights <= 0) {
      return res.status(400).json({ message: 'Guests and nights must be greater than zero' });
    }

    // Create booking
    const booking = await createBooking({
      room_id,
      branch_name,
      first_name,
      last_name,
      email,
      contact,
      id_number,
      guests,
      nights,
      additional_note,
      guest_id
    });

    res.status(201).json(booking)
    console.log('NEW BOOKING 👉', booking)

  } catch (error) {
    console.error('ADD BOOKING ERROR 👉', error);
    res.status(500).json({ message: error.message || 'Failed to create booking' });
  }
};


// Get all bookings for a specific guest
export const getGuestBookings = async (req, res) => {
  try {
    const { guestId } = req.params;

    if (!guestId) {
      return res.status(400).json({ message: 'guestId is required' });
    }

    const bookings = await BookingModel.getBookingsByGuestId(guestId);

    res.status(200).json(bookings);
  } catch (error) {
    console.error('GET GUEST BOOKINGS ERROR 👉', error);
    res.status(500).json({ message: error.message || 'Failed to fetch guest bookings' });
  }
};



export const getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.getAllBookings();
    res.status(200).json(bookings);
  } catch (error) {
    console.error('GET ALL BOOKINGS ERROR 👉', error);
    res.status(500).json({
      message: error.message || 'Failed to fetch bookings'
    });
  }
};
