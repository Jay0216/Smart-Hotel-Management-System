import express from 'express';
import {
  getBillingSummaryByGuest
} from '../controllers/billing.controller.js';

const router = express.Router();

router.get('/billing/:guestId', getBillingSummaryByGuest);


export default router;