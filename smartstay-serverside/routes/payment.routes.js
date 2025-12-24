import express from "express";
import { simulatePayment } from "../controllers/payment.controller.js";

const router = express.Router();

/**
 * POST /api/payments/simulate
 */
router.post("/simulate", simulatePayment);

export default router;

