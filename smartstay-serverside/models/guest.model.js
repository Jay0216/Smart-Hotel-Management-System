import { pool } from '../dbconnection.js';

export const createGuest = async (guest) => {
  const { firstName, lastName, email, password, imageUrl } = guest;

  const result = await pool.query(
    `INSERT INTO guests 
     (first_name, last_name, email, password, image_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING guest_id, email`,
    [firstName, lastName, email, password, imageUrl]
  );

  return result.rows[0];
};

export const findGuestByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM guests WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};
