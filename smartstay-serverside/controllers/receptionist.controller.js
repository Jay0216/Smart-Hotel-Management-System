import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';
import { createReceptionist, findReceptionistByEmail, findBranchByName, getAllReceptions } from '../models/receptionist.model.js';

export const registerReceptionist = async (req, res) => {
  try {
    const { firstName, lastName, email, password, branch } = req.body;

    if (!firstName || !lastName || !email || !password || !branch) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Find branch ID
    const branchRow = await findBranchByName(branch);

    console.log('Branch lookup result:', branchRow);
    if (!branchRow) {
      return res.status(400).json({ message: 'Invalid branch name' });
    }
    const branchId = branchRow.id;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create receptionist
    const receptionist = await createReceptionist({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      branchId,
    });

    res.status(201).json({
      message: 'Registration successful',
      user: receptionist
    });

  } catch (error) {
    console.error('REGISTER ERROR 👉', error.message);
    res.status(500).json({ message: 'Registration failed', error: error.message });
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

    const token = generateToken({
      staffId: receptionist.receptionist_id,
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
      },
    });
  } catch {
    res.status(500).json({ message: 'Login failed' });
  }
};


// Get all receptionists
export const fetchAllReceptions = async (req, res) => {
  try {
    const receptionsList = await getAllReceptions();
    res.status(200).json({ receptionsList });
  } catch (err) {
    console.error('FETCH RECEPTIONISTS ERROR 👉', err.message);
    res.status(500).json({ message: 'Failed to fetch receptionists ', error: err.message });
  }
};

