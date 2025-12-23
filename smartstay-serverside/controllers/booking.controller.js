import { createBooking } from '../models/booking.model.js';

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

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });

  } catch (error) {
    console.error('ADD BOOKING ERROR 👉', error);
    res.status(500).json({ message: error.message || 'Failed to create booking' });
  }
};
