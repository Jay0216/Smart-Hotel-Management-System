import { pool } from '../dbconnection.js';

// Find branch by name
export const findBranchByName = async (branchName) => {
  const result = await pool.query(
    `SELECT id FROM branches WHERE name = $1`,
    [branchName]
  );
  return result.rows[0]; // { id: number } or undefined
};

// Create staff with branch_id
export const createStaff = async (staff) => {
  const { firstName, lastName, email, password, branchId } = staff;

  const result = await pool.query(
    `INSERT INTO staff 
     (first_name, last_name, email, password, branch_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING staff_id, first_name, last_name, email, branch_id`,
    [firstName, lastName, email, password, branchId]
  );

  return result.rows[0];
};

// Find staff by email
export const findStaffByEmail = async (email) => {
  const result = await pool.query(
    `SELECT * FROM staff WHERE email = $1`,
    [email]
  );
  return result.rows[0];
};

// Get all staff
export const getAllStaff = async () => {
  const result = await pool.query(
    `SELECT s.staff_id, s.first_name, s.last_name, s.email, s.branch_id, b.name as branch_name
     FROM staff s
     JOIN branches b ON s.branch_id = b.id
     ORDER BY s.staff_id ASC`
  );
  return result.rows;
};
