import express from 'express';
import { addService, fetchServices } from '../controllers/service.controller.js';
import { upload } from '../middlewares/upload.middleware.js'; // reuse multer setup

const router = express.Router();

// Add new service with images
router.post('/addservice', upload.array('images', 5), addService);

// Get all services
router.get('/getservices', fetchServices);

export default router;

