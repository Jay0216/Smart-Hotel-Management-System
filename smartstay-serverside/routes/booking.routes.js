import express from 'express';
import { addBooking } from '../controllers/booking.controller.js';

const router = express.Router();

// POST /api/bookings
router.post('/makebookings', addBooking);

export default router;
