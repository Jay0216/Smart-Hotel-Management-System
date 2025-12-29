import { pool } from '../dbconnection.js';




export const performCheckAction = async ({
  bookingId,
  actionBy,
  receptionistId = null,
  actionType,
  notes = null,
  force = false // <-- new
}) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const bookingRes = await client.query(
      `SELECT b.booking_id, b.booking_status, b.room_id, b.guest_id
       FROM bookings b
       WHERE b.booking_id = $1`,
      [bookingId]
    );

    if (bookingRes.rowCount === 0) throw new Error('Booking not found');

    const booking = bookingRes.rows[0];
    const currentStatus = booking.booking_status;

    // Business rules
    if (actionType === 'checkin' && currentStatus !== 'SUCCESS') {
      throw new Error('Only confirmed bookings can be checked in');
    }
    if (actionType === 'checkout' && !force && currentStatus !== 'checked_in') {
      throw new Error('Only checked-in bookings can be checked out');
    }

    // Insert log
    await client.query(
      `INSERT INTO checkin_checkout_log
       (booking_id, action_by, receptionist_id, action_type, notes)
       VALUES ($1, $2, $3, $4, $5)`,
      [bookingId, actionBy, receptionistId, actionType, notes]
    );

    // Update booking status
    const newStatus = actionType === 'checkin' ? 'checked_in' : 'checked_out';
    await client.query(
      `UPDATE bookings SET booking_status = $1 WHERE booking_id = $2`,
      [newStatus, bookingId]
    );

    // Checkout only: update room status
    if (actionType === 'checkout') {
      await client.query(
        `UPDATE rooms SET status = 'Available' WHERE id = $1`,
        [booking.room_id]
      );
    }

    await client.query('COMMIT');

    return { bookingId, booking_status: newStatus, actionType };

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Check action error:', error);
    throw error;
  } finally {
    client.release();
  }
};

/**
 * Fetch check-in/check-out history for a booking
 */
export const getCheckLogByBookingId = async (bookingId) => {
  const result = await pool.query(
    `
    SELECT l.*, s.first_name, s.last_name
    FROM checkin_checkout_log l
    LEFT JOIN staff s ON l.staff_id = s.staff_id
    WHERE l.booking_id = $1
    ORDER BY l.action_time DESC
    `,
    [bookingId]
  );

  return result.rows;
};
