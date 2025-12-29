import express from 'express';
import { fetchAllStaff, loginStaff, registerStaff, fetchAssignableStaff } from '../controllers/staff.controller.js';

const router = express.Router();

router.post('/staffregister', registerStaff);
router.post('/stafflogin', loginStaff);
router.get('/getstaff', fetchAllStaff);
// Fetch available staff for a branch
router.get('/staff/assignable/:branchId', fetchAssignableStaff);



export default router;