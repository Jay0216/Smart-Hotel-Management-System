import express from 'express';
import { addBooking, getGuestBookings } from '../controllers/booking.controller.js';

const router = express.Router();

// POST /api/bookings
router.post('/makebookings', addBooking);
router.get('/guest/:guestId', getGuestBookings);

export default router;
