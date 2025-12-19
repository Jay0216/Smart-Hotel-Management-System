import { pool } from '../dbconnection.js';

export const createReceptionist = async (receptionist) => {
  const { firstName, lastName, email, password, imageUrl } = receptionist;

  const result = await pool.query(
    `INSERT INTO receptionist 
     (first_name, last_name, email, password, image_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING guest_id, email`,
    [firstName, lastName, email, password, imageUrl]
  );

  return result.rows[0];
};

export const findReceptionistByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM receptionist WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};