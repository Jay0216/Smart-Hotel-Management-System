import express from 'express';
import { loginStaff, registerStaff } from '../controllers/staff.controller.js';

const router = express.Router();

router.post('/staffregister', registerStaff);
router.post('/stafflogin', loginStaff);

export default router;