import { pool } from '../dbconnection.js';

export const getAllUsers = async (req, res) => {
  try {
    // Staff
    const staffResult = await pool.query(`
      SELECT 
        staff_id AS id,
        first_name,
        last_name,
        email,
        branch_id AS branch,
        'staff' AS role
      FROM staff
    `);

    // Receptionists
    const receptionistResult = await pool.query(`
      SELECT 
        receptionist_id AS id,
        first_name,
        last_name,
        email,
        branch_id AS branch,
        'receptionist' AS role
      FROM receptionist
    `);

    res.json({
      users: [...staffResult.rows, ...receptionistResult.rows],
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};
