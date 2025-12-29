import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  assignTask,
  getAssignedTasks,
  getTasksByRequestId, 
  getTasksByStaffId,
  updateTaskStatus
} from "../API/staffTasksAPI";

import type { AssignedTask, AssignTaskFormData } from "../API/staffTasksAPI";

/* ================== STATE TYPE ================== */

interface AssignedTaskState {
  tasks: AssignedTask[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: AssignedTaskState = {
  tasks: [],
  loading: false,
  error: null,
  success: false
};

/* ================== THUNKS ================== */

// ASSIGN TASK
export const assignTaskThunk = createAsyncThunk<
  AssignedTask,
  AssignTaskFormData,
  { rejectValue: string }
>(
  "assignedTasks/assign",
  async (data, { rejectWithValue }) => {
    try {
      const response = await assignTask(data);
      return response.assignedTask;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// FETCH ALL ASSIGNED TASKS
export const fetchAssignedTasksThunk = createAsyncThunk<
  AssignedTask[],
  void,
  { rejectValue: string }
>(
  "assignedTasks/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAssignedTasks();
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// FETCH TASKS BY SERVICE REQUEST
export const fetchTasksByRequestThunk = createAsyncThunk<
  AssignedTask[],
  number,
  { rejectValue: string }
>(
  "assignedTasks/fetchByRequest",
  async (requestId, { rejectWithValue }) => {
    try {
      const response = await getTasksByRequestId(requestId);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// FETCH TASKS BY STAFF ID
export const fetchTasksByStaffThunk = createAsyncThunk<
  AssignedTask[],
  number,
  { rejectValue: string }
>(
  "assignedTasks/fetchByStaff",
  async (staffId, { rejectWithValue }) => {
    try {
      const response = await getTasksByStaffId(staffId);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// UPDATE TASK STATUS
export const updateTaskStatusThunk = createAsyncThunk<
  AssignedTask,
  { taskId: number; status: 'in_progress' | 'completed' | 'pending' },
  { rejectValue: string }
>(
  "assignedTasks/updateStatus",
  async ({ taskId, status }, { rejectWithValue }) => {
    try {
      const response = await updateTaskStatus(taskId, status);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);


/* ================== SLICE ================== */

const assignedTaskSlice = createSlice({
  name: "assignedTasks",
  initialState,
  reducers: {
    clearAssignedTaskState: (state) => {
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder

      /* ===== ASSIGN TASK ===== */
      .addCase(assignTaskThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(assignTaskThunk.fulfilled, (state, action: PayloadAction<AssignedTask>) => {
        state.loading = false;
        state.success = true;
        state.tasks.unshift(action.payload); // add the newly assigned task
      })
      .addCase(assignTaskThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to assign task";
      })

      /* ===== FETCH ALL TASKS ===== */
      .addCase(fetchAssignedTasksThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignedTasksThunk.fulfilled, (state, action: PayloadAction<AssignedTask[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchAssignedTasksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tasks";
      })

      /* ===== FETCH TASKS BY REQUEST ===== */
      .addCase(fetchTasksByRequestThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksByRequestThunk.fulfilled, (state, action: PayloadAction<AssignedTask[]>) => {
        state.loading = false;
        // replace existing tasks for the same request
        const requestId = action.payload[0]?.request_id;
        if (requestId) {
          state.tasks = [
            ...state.tasks.filter(t => t.request_id !== requestId),
            ...action.payload
          ];
        }
      })
      .addCase(fetchTasksByRequestThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch tasks for request";
      })

      /* ===== FETCH TASKS BY STAFF ===== */
      .addCase(fetchTasksByStaffThunk.pending, (state) => {
          state.loading = true;
          state.error = null;
      })
      .addCase(fetchTasksByStaffThunk.fulfilled, (state, action: PayloadAction<AssignedTask[]>) => {
          state.loading = false;
          state.tasks = action.payload; // replace with staff-specific tasks
      })
      .addCase(fetchTasksByStaffThunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "Failed to fetch tasks for staff";
      })

      .addCase(updateTaskStatusThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskStatusThunk.fulfilled, (state, action: PayloadAction<AssignedTask>) => {
        state.loading = false;
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
         state.tasks[index] = action.payload; // update the specific task
        }
      })
     .addCase(updateTaskStatusThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to update task status";
     });
  }
});

/* ================== EXPORTS ================== */

export const { clearAssignedTaskState } = assignedTaskSlice.actions;

export default assignedTaskSlice.reducer;
