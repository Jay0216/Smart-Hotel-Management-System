import express from 'express';
import { addService } from '../controllers/service.controller.js';

const router = express.Router();

router.post('/services', addService);

export default router;
