import { pool } from '../dbconnection.js'; // your PostgreSQL pool connection

export const DashboardModel = {

  // 1️⃣ Occupancy: percentage of rooms booked per day (last 7 days)
  getOccupancyLast7Days: async () => {
    const query = `
      SELECT to_char(b.created_at, 'Dy') AS day,
             COUNT(b.booking_id)::float / (SELECT COUNT(*) FROM rooms) * 100 AS occupancy
      FROM bookings b
      WHERE b.booking_status IN ('checked_in','checked_out')
        AND b.created_at >= now() - interval '7 days'
      GROUP BY day
      ORDER BY min(b.created_at);
    `;
    const { rows } = await pool.query(query);
    return rows; // [{day: 'Mon', occupancy: 70}, ...]
  },

  // 2️⃣ Revenue: sum of successful payments per month (last 6 months)
  getRevenueLast6Months: async () => {
  const query = `
    SELECT 
        to_char(date_trunc('month', p.created_at), 'Mon') AS month,
        SUM(p.amount)::float AS revenue
    FROM payments p
    WHERE p.payment_status = 'SUCCESS'
      AND p.created_at >= date_trunc('month', CURRENT_DATE) - interval '6 months'
    GROUP BY date_trunc('month', p.created_at)
    ORDER BY date_trunc('month', p.created_at);
  `;
  const { rows } = await pool.query(query);
  return rows; // [{month:'Jan', revenue: 1200}, ...]
},

  // 3️⃣ Booking trends: number of bookings per room type (all time)
  getBookingTrends: async () => {
    const query = `
      SELECT r.room_type,
             COUNT(b.booking_id) AS bookings
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      GROUP BY r.room_type
      ORDER BY bookings DESC;
    `;
    const { rows } = await pool.query(query);
    return rows; // [{room_type:'Luxury', bookings:10}, ...]
  }

};
