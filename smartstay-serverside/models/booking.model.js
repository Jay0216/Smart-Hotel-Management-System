import { pool } from '../dbconnection.js';

export const createBooking = async ({
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
  guest_id // now required
}) => {
  if (!guest_id) {
    throw new Error('guest_id is required for booking');
  }

  // Step 1: Get branch_id from branch_name
  const branchQuery = 'SELECT id FROM branches WHERE name = $1 LIMIT 1';
  const branchResult = await pool.query(branchQuery, [branch_name]);

  if (branchResult.rows.length === 0) {
    throw new Error('Branch not found');
  }

  const branch_id = branchResult.rows[0].id;

  // Step 2: Insert booking
  const query = `
    INSERT INTO bookings (
      room_id,
      branch_id,
      guest_id,
      first_name,
      last_name,
      email,
      contact,
      id_number,
      guests,
      nights,
      additional_note
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING *
  `;

  const values = [
    room_id,
    branch_id,
    guest_id,
    first_name,
    last_name,
    email,
    contact,
    id_number || null,
    guests,
    nights,
    additional_note || null
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
};


export const BookingModel = {
  updateBookingStatus: async (booking_id, status) => {
    const query = `
      UPDATE bookings
      SET booking_status = $1
      WHERE booking_id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [status, booking_id]);
    return rows[0];
  },

  getBookingsByGuestId: async (guest_id) => {
  const query = `
    SELECT
      b.*,
      r.room_name,
      br.name AS branch_name,

      -- payment details
      COALESCE(p.amount, 0) AS paid_amount,
      p.currency,
      p.payment_status

    FROM bookings b
    JOIN rooms r ON b.room_id = r.id
    JOIN branches br ON b.branch_id = br.id

    LEFT JOIN payments p
      ON p.booking_id = b.booking_id
     AND p.payment_status = 'SUCCESS'

    WHERE b.guest_id = $1
    ORDER BY b.created_at DESC;
  `;

  const { rows } = await pool.query(query, [guest_id]);
  return rows;
},

getAllBookings: async () => {
    const query = `
      SELECT
        b.*,
        r.room_name,
        br.name AS branch_name,

        COALESCE(p.amount, 0) AS paid_amount,
        p.currency,
        p.payment_status

      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN branches br ON b.branch_id = br.id

      LEFT JOIN payments p
        ON p.booking_id = b.booking_id
       AND p.payment_status = 'SUCCESS'

      ORDER BY b.created_at DESC;
    `;

    const { rows } = await pool.query(query);
    return rows;
  }


  
};


