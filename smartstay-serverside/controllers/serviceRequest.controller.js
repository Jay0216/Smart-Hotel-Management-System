// controllers/serviceRequest.controller.js
import { ServiceRequestModel } from "../models/serviceRequest.model.js";
import { pool } from "../dbconnection.js";

export const createServiceRequest = async (req, res) => {
  try {
    const {
      guest_id,
      branch_name,
      service_id,
      request_note
    } = req.body;

    if (!guest_id || !branch_name || !service_id) {
      return res.status(400).json({
        message: "guest_id, branch_name, and service_id are required"
      });
    }

    // Get branch_id from branch_name
    const branchResult = await pool.query(
      "SELECT id FROM branches WHERE name = $1",
      [branch_name]
    );

    if (branchResult.rowCount === 0) {
      return res.status(404).json({ message: "Branch not found" });
    }

    const branch_id = branchResult.rows[0].id;

    // Get the most recent active booking for this guest in this branch
    const bookingResult = await pool.query(
      `SELECT booking_id 
       FROM bookings
       WHERE guest_id = $1
         AND branch_id = $2
         AND booking_status != 'checked_out'
       ORDER BY booking_id DESC
       LIMIT 1`,
      [guest_id, branch_id]
    );

    if (bookingResult.rowCount === 0) {
      return res.status(400).json({ 
        message: "No active booking found for this guest in this branch" 
      });
    }

    const booking_id = bookingResult.rows[0].booking_id;

    const request = await ServiceRequestModel.createRequest({
      guest_id,
      branch_id,
      service_id,
      booking_id,
      request_note
    });

    res.status(201).json(request);

  } catch (error) {
    console.error("CREATE SERVICE REQUEST ERROR 👉", error);
    res.status(500).json({ message: "Failed to create service request" });
  }
};

export const getGuestServiceRequests = async (req, res) => {
  try {
    const { guestId } = req.params;

    const requests = await ServiceRequestModel.getRequestsByGuestId(guestId);
    res.status(200).json(requests);

  } catch (error) {
    console.error("GET GUEST SERVICE REQUESTS ERROR 👉", error);
    res.status(500).json({ message: "Failed to fetch service requests" });
  }
};

export const getBranchServiceRequests = async (req, res) => {
  try {
    const { branchId } = req.params;

    const requests = await ServiceRequestModel.getRequestsByBranchId(branchId);
    res.status(200).json(requests);

  } catch (error) {
    console.error("GET BRANCH SERVICE REQUESTS ERROR 👉", error);
    res.status(500).json({ message: "Failed to fetch branch requests" });
  }
};

export const updateServiceRequestStatus = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updated = await ServiceRequestModel.updateRequestStatus(
      requestId,
      status
    );

    res.status(200).json(updated);

  } catch (error) {
    console.error("UPDATE SERVICE REQUEST STATUS ERROR 👉", error);
    res.status(500).json({ message: "Failed to update request status" });
  }
};


export const getAllServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequestModel.getAllRequests();
    res.status(200).json(requests);
  } catch (error) {
    console.error("GET ALL SERVICE REQUESTS ERROR 👉", error);
    res.status(500).json({ message: "Failed to fetch all service requests" });
  }
};
