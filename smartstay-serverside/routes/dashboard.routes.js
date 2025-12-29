import express from 'express';
import { getOccupancy, getRevenue, getBookingTrends } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/stats/occupancy', getOccupancy);
router.get('/stats/revenue', getRevenue);
router.get('/stats/trends', getBookingTrends);

export default router;
