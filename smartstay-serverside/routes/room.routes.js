import express from 'express';
import { addRoom, fetchRooms } from '../controllers/room.controller.js';
import { upload } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.post(
  '/addrooms',
  upload.array('images', 5),
  addRoom
);

// Get all rooms
router.get('/getrooms', fetchRooms);

export default router;

