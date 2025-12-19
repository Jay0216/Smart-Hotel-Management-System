import { pool } from '../dbconnection.js';

export const createAdmin = async (admin) => {
  const { firstName, lastName, email, password, imageUrl } = admin;

  const result = await pool.query(
    `INSERT INTO administrator
     (first_name, last_name, email, password, image_url)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING admin_id, email`,
    [firstName, lastName, email, password, imageUrl]
  );

  return result.rows[0];
};

export const findAdminByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM administrator WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};