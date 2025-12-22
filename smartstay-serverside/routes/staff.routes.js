import express from 'express';
import { fetchAllStaff, loginStaff, registerStaff } from '../controllers/staff.controller.js';

const router = express.Router();

router.post('/staffregister', registerStaff);
router.post('/stafflogin', loginStaff);
router.get('/getstaff', fetchAllStaff);

export default router;