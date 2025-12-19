import express from 'express';
import { loginReceptionist, registerReceptionist } from '../controllers/receptionist.controller.js';

const router = express.Router();

router.post('/receptionistregister', registerReceptionist);
router.post('/receptionistlogin', loginReceptionist);

export default router;