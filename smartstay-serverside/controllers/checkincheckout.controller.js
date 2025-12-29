import {
  performCheckAction,
  getCheckLogByBookingId
} from '../models/checkincheckout.model.js';

/**
 * Check-in / Check-out controller
 */
export const handleCheckAction = async (req, res) => {
  try {
    const {
      bookingId,
      actionBy,
      receptionistId,
      actionType,
      notes
    } = req.body;

    if (!bookingId || !actionBy || !actionType) {
      return res.status(400).json({
        message: 'bookingId, actionBy, and actionType are required'
      });
    }

    const result = await performCheckAction({
      bookingId,
      actionBy,
      receptionistId,
      actionType,
      notes, 
    });

    res.status(200).json({
      message: `Successfully ${actionType}ed`,
      result
    });
  } catch (err) {
    console.error('Check action error:', err);
    res.status(400).json({
      message: err.message
    });
  }
};

/**
 * Get check-in/check-out history for a booking
 */
export const fetchCheckLogByBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const logs = await getCheckLogByBookingId(bookingId);

    res.json({ logs });
  } catch (err) {
    console.error('Fetch log error:', err);
    res.status(500).json({
      message: 'Failed to fetch check log'
    });
  }
};
