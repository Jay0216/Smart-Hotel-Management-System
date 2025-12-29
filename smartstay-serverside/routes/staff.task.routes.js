import express from 'express';
import {
  assignTask,
  fetchAllAssignedTasks,
  fetchTasksByRequestId, 
  fetchTasksByStaffId,
  updateTaskStatusController
} from '../controllers/staff.task.controller.js';

const router = express.Router();

// Assign a new task
router.post('/assign', assignTask);

// Get all assigned tasks
router.get('/', fetchAllAssignedTasks);

// Get assigned tasks for a specific service request
router.get('/request/:requestId', fetchTasksByRequestId);

router.get('/staff/:staffId', fetchTasksByStaffId);

router.put('/assigned-tasks/:taskId', updateTaskStatusController);

export default router;
