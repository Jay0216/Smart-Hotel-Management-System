import express from 'express';
import { registerGuest, loginGuest } from '../controllers/guest.controller.js';

const router = express.Router();

router.post('/register', registerGuest);
router.post('/login', loginGuest);

export default router;
