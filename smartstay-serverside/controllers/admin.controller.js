import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';
import { pool } from '../dbconnection.js';
import { findAdminByEmail } from '../models/admin.model.js';

export const registerAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password, imageUrl } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO administrator (
        first_name,
        last_name,
        email,
        password,
        image_url
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING admin_id, first_name, last_name, email, image_url
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

export const loginAdmin = async (req, res) => {

  console.log('Login payload:', req.body);
  try {
    const { email, password } = req.body;

    const admin = await findAdminByEmail(email);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log("Admin from DB:", admin);
    console.log("Compare result:", await bcrypt.compare(password, admin.password));

    const token = generateToken({
      adminId: admin.admin_id,
      email: admin.email,
      role: 'admin',
    });

    res.json({
      token,
      user: {
        id: admin.admin_id,
        firstName: admin.first_name,
        lastName: admin.last_name,
        email: admin.email,
        role: 'admin',
        imageUrl: admin.image_url,
      },
    });
  } catch {
    res.status(500).json({ message: 'Login failed' });
  }
};
