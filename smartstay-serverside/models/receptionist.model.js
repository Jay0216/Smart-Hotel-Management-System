import { pool } from '../dbconnection.js';

// Find branch by name
export const findBranchByName = async (branchName) => {
  const result = await pool.query(
    `SELECT id FROM branches WHERE name = $1`,
    [branchName]
  );
  return result.rows[0]; // { id: number } or undefined
};

// Create receptionist with branch_id
export const createReceptionist = async (receptionist) => {
  const { firstName, lastName, email, password, branchId } = receptionist;

  const result = await pool.query(
    `INSERT INTO receptionist 
     (first_name, last_name, email, password, branch_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING receptionist_id, first_name, last_name, email, branch_id`,
    [firstName, lastName, email, password, branchId]
  );

  return result.rows[0];
};

// Find receptionist by email
export const findReceptionistByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM receptionist WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};

// Get all staff
export const getAllReceptions = async () => {
  const result = await pool.query(
    `SELECT r.receptionist_id, r.first_name, r.last_name, r.email, r.branch_id, b.name as branch_name
     FROM receptionist r
     JOIN branches b ON r.branch_id = b.id
     ORDER BY r.receptionist_id ASC`
  );
  return result.rows;
};
