import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { registerStaff, loginStaff, fetchAssignableStaffByBranch } from '../API/staffAPI';
import type { RegisterPayload, LoginPayload, AuthResponse } from '../API/hotelStaffAuthTypes';

interface StaffState {
  currentStaff: AuthResponse['user'] | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  assignableStaff: StaffMember[];
}

interface StaffMember {
  staff_id: string;
  first_name: string;
  last_name: string;
  email: string;
  branch_id: string;
  branch_name: string;
}


const initialState: StaffState = {
  currentStaff: JSON.parse(localStorage.getItem('staffUser') || 'null'),
  token: localStorage.getItem('staffToken'),
  loading: false,
  error: null,
  assignableStaff: [],
};

// ---- Thunks ----
export const staffRegisterThunk = createAsyncThunk<void, RegisterPayload>(
  'staff/register',
  async (data, { rejectWithValue }) => {
    try {
      await registerStaff(data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Staff registration failed');
    }
  }
);

export const staffLoginThunk = createAsyncThunk<AuthResponse, LoginPayload>(
  'staff/login',
  async (data, { rejectWithValue }) => {
    try {
      return await loginStaff(data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Staff login failed');
    }
  }
);

// Thunk to fetch assignable staff
export const fetchAssignableStaffThunk = createAsyncThunk<
  StaffMember[],
  number
>(
  'staff/fetchAssignable',
  async (branchId, { rejectWithValue }) => {
    try {
      const res = await fetchAssignableStaffByBranch(branchId);
      return res.staff;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch staff');
    }
  }
);

// ---- Slice ----
const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    staffLogout: (state) => {
      state.currentStaff = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem('staffToken');
      localStorage.removeItem('staffUser');
    },
    setStaffFromStorage: (state, action: PayloadAction<{ user: AuthResponse['user']; token: string }>) => {
      state.currentStaff = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(staffRegisterThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(staffRegisterThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(staffRegisterThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // LOGIN
      .addCase(staffLoginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(staffLoginThunk.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.currentStaff = action.payload.user;
        state.token = action.payload.token;

        // Store in localStorage
        localStorage.setItem('staffToken', action.payload.token);
        localStorage.setItem('staffUser', JSON.stringify(action.payload.user));
      })
      .addCase(staffLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAssignableStaffThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAssignableStaffThunk.fulfilled, (state, action: PayloadAction<StaffMember[]>) => {
        state.loading = false;
        state.assignableStaff = action.payload;
      })
      .addCase(fetchAssignableStaffThunk.rejected, (state, action) => {
       state.loading = false;
       state.error = action.payload as string;
      });
  },
});

export const { staffLogout, setStaffFromStorage } = staffSlice.actions;
export default staffSlice.reducer;
