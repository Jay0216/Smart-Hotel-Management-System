import express from 'express';
import { loginAdmin, registerAdmin } from '../controllers/admin.controller.js';

const router = express.Router();

router.post('/adminregister', registerAdmin);
router.post('/adminlogin', loginAdmin);

export default router;