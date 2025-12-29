import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.js';
import { createStaff, findStaffByEmail, findBranchByName, getAllStaff, getAvailableStaffByBranch } from '../models/staff.model.js';

export const registerStaff = async (req, res) => {
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

    // Create staff
    const staff = await createStaff({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      branchId,
    });

    res.status(201).json({
      message: 'Registration successful',
      user: staff
    });

  } catch (error) {
    console.error('REGISTER ERROR 👉', error.message);
    res.status(500).json({ message: 'Registration failed', error: error.message });
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
      },
    });
  } catch {
    res.status(500).json({ message: 'Login failed' });
  }
};


// Get all staff
export const fetchAllStaff = async (req, res) => {
  try {
    const staffList = await getAllStaff();
    console.log('Fetched staff list:', staffList);
    res.status(200).json({ staffList });
  } catch (err) {
    console.error('FETCH STAFF ERROR 👉', err.message);
    res.status(500).json({ message: 'Failed to fetch staff', error: err.message });
  }
};


// controllers/staff.controller.js

export const fetchAssignableStaff = async (req, res) => {
  try {
    const { branchId } = req.params;

    if (!branchId) {
      return res.status(400).json({ message: 'branchId is required' });
    }

    const staff = await getAvailableStaffByBranch(branchId);

    res.status(200).json({ staff });
  } catch (err) {
    console.error('FETCH ASSIGNABLE STAFF ERROR 👉', err.message);
    res.status(500).json({
      message: 'Failed to fetch assignable staff',
      error: err.message
    });
  }
};


