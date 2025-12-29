import express from 'express';
import { addBooking, getGuestBookings, getAllBookings } from '../controllers/booking.controller.js';

const router = express.Router();

// POST /api/bookings
router.post('/makebookings', addBooking);
router.get('/guest/:guestId', getGuestBookings);
router.get('/', getAllBookings);    

export default router;
