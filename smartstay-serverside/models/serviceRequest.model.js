// models/serviceRequest.model.js
import { pool } from "../dbconnection.js";

export const ServiceRequestModel = {
  // Create new service request
  createRequest: async ({
    guest_id,
    branch_id,
    service_id,
    request_note
  }) => {
    const query = `
      INSERT INTO service_requests
        (guest_id, branch_id, service_id, request_note)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [guest_id, branch_id, service_id, request_note];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  // Get requests by guest
  getRequestsByGuestId: async (guest_id) => {
    const query = `
      SELECT
        sr.id,
        sr.guest_id,
        sr.branch_id,
        sr.service_id,
        sr.request_status,
        sr.request_note,
        sr.requested_at,
        sr.updated_at,
        s.name AS service_name,
        b.name AS branch_name
      FROM service_requests sr
      JOIN services s ON sr.service_id = s.id
      JOIN branches b ON sr.branch_id = b.id
      WHERE sr.guest_id = $1
      ORDER BY sr.requested_at DESC;
    `;

    const { rows } = await pool.query(query, [guest_id]);
    return rows;
  },

  // Admin: get requests by branch
  getRequestsByBranchId: async (branch_id) => {
    const query = `
      SELECT
        sr.id,
        sr.request_status,
        sr.request_note,
        sr.requested_at,
        s.name,
        g.first_name,
        g.last_name
      FROM service_requests sr
      JOIN services s ON sr.service_id = s.id
      JOIN guests g ON sr.guest_id = g.guest_id
      WHERE sr.branch_id = $1
      ORDER BY sr.requested_at DESC;
    `;

    const { rows } = await pool.query(query, [branch_id]);
    return rows;
  },

  // Update request status
  updateRequestStatus: async (id, status) => {
    const query = `
      UPDATE service_requests
      SET request_status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *;
    `;

    const { rows } = await pool.query(query, [status, id]);
    return rows[0];
  },

  getAllRequests: async () => {
  const query = `
    SELECT
      sr.id,
      sr.guest_id,
      sr.branch_id,
      sr.service_id,
      sr.request_status,
      sr.request_note,
      sr.requested_at,
      sr.updated_at,
      s.name AS service_name,
      b.name AS branch_name,
      g.first_name,
      g.last_name
    FROM service_requests sr
    JOIN services s ON sr.service_id = s.id
    JOIN branches b ON sr.branch_id = b.id
    JOIN guests g ON sr.guest_id = g.guest_id
    ORDER BY sr.requested_at DESC;
  `;

  const { rows } = await pool.query(query);
  return rows;
},
};
