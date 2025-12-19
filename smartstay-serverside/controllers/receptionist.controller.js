import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';
import { pool } from '../dbconnection.js';
import { findReceptionistByEmail } from '../models/receptionist.model.js';

export const registerReceptionist = async (req, res) => {
  try {
    const { firstName, lastName, email, password, imageUrl } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO receptionist (
        first_name,
        last_name,
        email,
        password,
        image_url
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING receptionist_id, first_name, last_name, email, image_url
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

export const loginReceptionist = async (req, res) => {
  try {
    const { email, password } = req.body;

    const receptionist = await findReceptionistByEmail(email);
    if (!receptionist) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, receptionist.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log("Receptionist from DB:", receptionist);
    console.log("Compare result:", await bcrypt.compare(password, receptionist.password));

    const token = generateToken({
      receptionistId: receptionist.receptionist_id,
      email: receptionist.email,
      role: 'receptionist',
    });

    res.json({
      token,
      user: {
        id: receptionist.receptionist_id,
        firstName: receptionist.first_name,
        lastName: receptionist.last_name,
        email: receptionist.email,
        role: 'receptionist',
        imageUrl: receptionist.image_url,
      },
    });
  } catch {
    res.status(500).json({ message: 'Login failed' });
  }
};
