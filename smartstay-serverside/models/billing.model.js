import { pool } from '../dbconnection.js';

export const getBillingSummaryByGuestId = async (guestId) => {
  const query = `
    SELECT
      b.booking_id,
      br.name AS branch_name,
      br.tax_rate,
      COALESCE(SUM(p.amount), 0) AS room_paid_amount, 
      COALESCE(SUM(s.price), 0) AS service_total
    FROM bookings b
    JOIN branches br ON b.branch_id = br.id
    LEFT JOIN payments p
      ON p.booking_id = b.booking_id
      AND p.payment_status = 'SUCCESS'
    LEFT JOIN service_requests sr
      ON sr.booking_id = b.booking_id
      AND sr.request_status = 'completed'
    LEFT JOIN services s
      ON sr.service_id = s.id
    WHERE b.guest_id = $1
      AND b.booking_status != 'checked_out'   -- only active/current bookings
    GROUP BY
      b.booking_id,
      br.name,
      br.tax_rate
    ORDER BY b.booking_id DESC
    LIMIT 1;  -- get the most recent active booking
  `;

  const { rows } = await pool.query(query, [guestId]);
  return rows[0]; // latest active booking
};




