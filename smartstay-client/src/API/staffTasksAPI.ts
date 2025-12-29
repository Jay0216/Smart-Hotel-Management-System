const API_BASE_URL = 'http://localhost:3000/api/assigned-tasks';

/** Interface for assigning a task */
export interface AssignTaskFormData {
  requestId: number;
  staffId: number;
  taskName?: string; // optional
  notes?: string;    // optional
}

/** Interface for assigned task object returned from backend */
export interface AssignedTask {
  id: number;
  request_id: number;
  staff_id: number;
  task_name: string;
  notes?: string;
  status: 'in_progress' | 'completed';
  assigned_at: string;
  staff_name?: string;   // optional, useful for UI
  branch_name?: string;  // optional
}

/** Response after assigning a task */
export interface AssignTaskResponse {
  message: string;
  assignedTask: AssignedTask;
}

/**
 * Assign a staff to a task
 * @param formData 
 * @returns {Promise<AssignTaskResponse>}
 */
export const assignTask = async (formData: AssignTaskFormData): Promise<AssignTaskResponse> => {
  const response = await fetch(`${API_BASE_URL}/assign`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to assign task');
  }

  return response.json();
};

/**
 * Fetch all assigned tasks
 * @returns {Promise<AssignedTask[]>}
 */
export const getAssignedTasks = async (): Promise<AssignedTask[]> => {
  const response = await fetch(`${API_BASE_URL}/all`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch assigned tasks');
  }

  const data = await response.json();
  return data.tasks;
};

/**
 * Fetch assigned tasks for a specific request
 * @param requestId 
 * @returns {Promise<AssignedTask[]>}
 */
export const getTasksByRequestId = async (requestId: number): Promise<AssignedTask[]> => {
  const response = await fetch(`${API_BASE_URL}/request/${requestId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch tasks for request');
  }

  const data = await response.json();
  return data.tasks;
};

// Fetch tasks for a specific staff
export const getTasksByStaffId = async (staffId: number): Promise<AssignedTask[]> => {
  const response = await fetch(`${API_BASE_URL}/staff/${staffId}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch tasks');
  }

  return response.json();
};



/**
 * Update the status of a task
 * @param taskId 
 * @param status 
 * @returns {Promise<AssignedTask>}
 */
export const updateTaskStatus = async (taskId: number, status: 'in_progress' | 'completed' | 'pending'): Promise<AssignedTask> => {
  const response = await fetch(`${API_BASE_URL}/assigned-tasks/${taskId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to update task status');
  }

  return response.json();
};

