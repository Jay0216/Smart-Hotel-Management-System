import express from 'express';
import {
  handleCheckAction,
  fetchCheckLogByBooking
} from '../controllers/checkincheckout.controller.js';

const router = express.Router();

/**
 * POST → Check-in or Check-out
 */
router.post('/action', handleCheckAction);

/**
 * GET → Booking check-in/check-out history
 */
router.get('/logs/:bookingId', fetchCheckLogByBooking);

export default router;
