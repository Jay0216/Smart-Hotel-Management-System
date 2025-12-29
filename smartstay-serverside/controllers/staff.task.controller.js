import {
  createAssignedTask,
  getTasksByRequestId,
  getAllAssignedTasks, 
  getTasksByStaffId,
  updateTaskStatus
} from '../models/staff.task.model.js';

// Assign a task to a staff member
export const assignTask = async (req, res) => {
  try {
    const { requestId, staffId, taskName, notes } = req.body;

    if (!requestId || !staffId) {
      return res.status(400).json({ message: 'requestId and staffId are required' });
    }

    const assignedTask = await createAssignedTask({ requestId, staffId, taskName, notes });
    res.status(201).json({ message: 'Task assigned successfully', assignedTask });
  } catch (err) {
    console.error('Error assigning task:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// Get all assigned tasks
export const fetchAllAssignedTasks = async (req, res) => {
  try {
    const tasks = await getAllAssignedTasks();
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// Get tasks for a specific service request
export const fetchTasksByRequestId = async (req, res) => {
  try {
    const { requestId } = req.params;
    const tasks = await getTasksByRequestId(requestId);
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks by request:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

// Get tasks assigned to a specific staff member
export const fetchTasksByStaffId = async (req, res) => {
  try {
    const { staffId } = req.params;

    if (!staffId) {
      return res.status(400).json({ message: 'staffId is required' });
    }

    const tasks = await getTasksByStaffId(staffId);
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks for staff:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

export const updateTaskStatusController = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;

    if (!taskId || !status) {
      return res.status(400).json({ message: 'taskId and status are required' });
    }

    const updatedTask = await updateTaskStatus(Number(taskId), status);
    res.json({ message: 'Task status updated successfully', updatedTask });
  } catch (err) {
    console.error('Error updating task status:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};