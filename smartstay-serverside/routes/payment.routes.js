import express from "express";
import { simulatePayment } from "../controllers/payment.controller.js";
import { simulateReceptionPayment } from "../controllers/receptionist.payment.controller.js";

const router = express.Router();

/**
 * POST /api/payments/simulate
 */
router.post("/simulate", simulatePayment);
router.post("/simulatereception", simulateReceptionPayment);

export default router;

