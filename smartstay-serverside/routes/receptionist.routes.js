import express from 'express';
import { loginReceptionist, registerReceptionist, fetchAllReceptions } from '../controllers/receptionist.controller.js';

const router = express.Router();

router.post('/receptionistregister', registerReceptionist);
router.post('/receptionistlogin', loginReceptionist);
router.get('/getreceptionists', fetchAllReceptions);

export default router;