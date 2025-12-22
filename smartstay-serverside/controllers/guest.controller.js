import bcrypt from 'bcrypt';
import { createGuest, findGuestByEmail } from '../models/guest.model.js';
import { generateToken } from '../utils/jwt.js';
import { pool } from '../dbconnection.js';

export const registerGuest = async (req, res) => {
  try {
    const { firstName, lastName, email, password, imageUrl } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = `
      INSERT INTO guests (
        first_name,
        last_name,
        email,
        password,
        image_url
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING guest_id, first_name, last_name, email, image_url
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

export const loginGuest = async (req, res) => {
  try {
    const { email, password } = req.body;

    const guest = await findGuestByEmail(email);
    if (!guest) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, guest.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log("Guest from DB:", guest);
    console.log("Compare result:", await bcrypt.compare(password, guest.password));

    const token = generateToken({
      guestId: guest.guest_id,
      email: guest.email,
      role: 'guest',
    });

    res.json({
      token,
      guest: {
        id: guest.guest_id,
        firstName: guest.first_name,
        lastName: guest.last_name,
        email: guest.email,
        imageUrl: guest.image_url,
        role: 'guest',
      },
    });
  } catch {
    res.status(500).json({ message: 'Login failed' });
  }
};
