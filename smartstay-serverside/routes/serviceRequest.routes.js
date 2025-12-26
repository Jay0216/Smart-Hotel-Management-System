// routes/serviceRequest.routes.js
import express from "express";
import {
  createServiceRequest,
  getGuestServiceRequests,
  getBranchServiceRequests,
  updateServiceRequestStatus
} from "../controllers/serviceRequest.controller.js";

const router = express.Router();

// Guest creates service request
router.post("/", createServiceRequest);

// Guest views their requests
router.get("/guest/:guestId", getGuestServiceRequests);

// Admin views branch requests
router.get("/branch/:branchId", getBranchServiceRequests);

// Admin updates request status
router.put("/:requestId/status", updateServiceRequestStatus);

export default router;
