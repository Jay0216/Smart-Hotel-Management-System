import { pool } from '../dbconnection.js';

// Create a new assigned task
export const createAssignedTask = async ({ requestId, staffId, taskName, notes }) => {
  const result = await pool.query(
    `INSERT INTO assigned_tasks (request_id, staff_id, task_name, notes)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [requestId, staffId, taskName, notes || null]
  );

  // Optionally, update the service request status to 'in_progress'
  await pool.query(
    `UPDATE service_requests SET request_status='in_progress' WHERE id = $1`,
    [requestId]
  );

  return result.rows[0];
};

// Get assigned tasks by service request
export const getTasksByRequestId = async (requestId) => {
  const result = await pool.query(
    `SELECT t.*, s.first_name, s.last_name
     FROM assigned_tasks t
     JOIN staff s ON t.staff_id = s.staff_id
     WHERE t.request_id = $1
     ORDER BY t.assigned_at DESC`,
    [requestId]
  );
  return result.rows;
};

// Get all assigned tasks
export const getAllAssignedTasks = async () => {
  const result = await pool.query(
    `SELECT t.*, s.first_name, s.last_name, r.service_name
     FROM assigned_tasks t
     JOIN staff s ON t.staff_id = s.staff_id
     JOIN service_requests r ON t.request_id = r.id
     ORDER BY t.assigned_at DESC`
  );
  return result.rows;
};

// Optional: Get assigned tasks by staff
export const getTasksByStaffId = async (staffId) => {
  const result = await pool.query(
    `SELECT t.*, s.name AS service_name, r.branch_id
     FROM assigned_tasks t
     JOIN service_requests r ON t.request_id = r.id
     JOIN services s ON r.service_id = s.id
     WHERE t.staff_id = $1
     ORDER BY t.assigned_at DESC`,
    [staffId]
  );
  return result.rows;
};


// Update task status (both assigned_tasks and service_requests)
export const updateTaskStatus = async (taskId, newStatus) => {
  try {
    // Update assigned_tasks
    const taskResult = await pool.query(
      `UPDATE assigned_tasks
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [newStatus, taskId]
    );

    const updatedTask = taskResult.rows[0];
    if (!updatedTask) {
      throw new Error('Task not found');
    }

    // Optionally, also update the service_requests table if task is completed
    // e.g., mark the service_request as 'completed' only if all tasks are completed
    if (newStatus === 'completed') {
      // Check if all tasks for this request are completed
      const pendingTasks = await pool.query(
        `SELECT COUNT(*) FROM assigned_tasks
         WHERE request_id = $1 AND status != 'completed'`,
        [updatedTask.request_id]
      );

      if (Number(pendingTasks.rows[0].count) === 0) {
        await pool.query(
          `UPDATE service_requests
           SET request_status = 'completed'
           WHERE id = $1`,
          [updatedTask.request_id]
        );
      }
    } else {
      // If task is not completed, ensure service_request is in_progress
      await pool.query(
        `UPDATE service_requests
         SET request_status = 'in_progress'
         WHERE id = $1`,
        [updatedTask.request_id]
      );
    }

    return updatedTask;
  } catch (err) {
    throw err;
  }
};


