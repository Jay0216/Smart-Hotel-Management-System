import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';
import { pool } from '../dbconnection.js';
import { findStaffByEmail } from '../models/staff.model.js';

export const registerStaff = async (req, res) => {
  try {
    const { firstName, lastName, email, password, imageUrl } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO staff (
        first_name,
        last_name,
        email,
        password,
        image_url
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING staff_id, first_name, last_name, email, image_url
    `;

    const values = [
      firstName,
      lastName,
      email,
      hashedPassword,
      imageUrl || null
    ];

    const result = await pool.query(query, values);

    res.status(201).json({
      message: 'Registration successful',
      user: result.rows[0]
    });

  } catch (error) {
    console.error('REGISTER ERROR 👉', error.message);
    res.status(500).json({
      message: 'Registration failed',
      error: error.message // keep only during development
    });
  }
};

export const loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;

    const staff = await findStaffByEmail(email);
    if (!staff) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log("Staff from DB:", staff);
    console.log("Compare result:", await bcrypt.compare(password, staff.password));

    const token = generateToken({
      staffId: staff.staff_id,
      email: staff.email,
      role: 'staff',
    });

    res.json({
      token,
      user: {
        id: staff.staff_id,
        firstName: staff.first_name,
        lastName: staff.last_name,
        email: staff.email,
        role: 'staff',
        imageUrl: staff.image_url,
      },
    });
  } catch {
    res.status(500).json({ message: 'Login failed' });
  }
};
