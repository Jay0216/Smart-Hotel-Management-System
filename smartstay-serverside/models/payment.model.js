import { pool } from "../dbconnection.js";

export const PaymentModel = {
  createPayment: async ({
    guest_id,
    booking_id,
    amount,
    currency = "LKR",
    payment_method,
    payment_status,
    transaction_ref
  }) => {
    const query = `
      INSERT INTO payments (
        guest_id,
        booking_id,
        amount,
        currency,
        payment_method,
        payment_status,
        transaction_ref
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      RETURNING *;
    `;

    const values = [
      guest_id,
      booking_id,
      amount,
      currency,
      payment_method,
      payment_status,
      transaction_ref
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  updatePaymentStatus: async (payment_id, status) => {
    const query = `
      UPDATE payments
      SET payment_status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE payment_id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [status, payment_id]);
    return rows[0];
  },

  getPaymentsByBooking: async (booking_id) => {
    const query = `
      SELECT * FROM payments
      WHERE booking_id = $1
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query, [booking_id]);
    return rows;
  }
};
