import { pool } from '../dbconnection.js';

export const createStaff = async (staff) => {
  const { firstName, lastName, email, password, imageUrl } = staff;

  const result = await pool.query(
    `INSERT INTO staff 
     (first_name, last_name, email, password, image_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING guest_id, email`,
    [firstName, lastName, email, password, imageUrl]
  );

  return result.rows[0];
};

export const findStaffByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM staff WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};