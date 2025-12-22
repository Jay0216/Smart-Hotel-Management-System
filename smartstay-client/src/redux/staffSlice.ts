import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { registerStaff, loginStaff } from '../API/staffAPI';
import type { RegisterPayload, LoginPayload, AuthResponse } from '../API/hotelStaffAuthTypes';

interface StaffState {
  currentStaff: AuthResponse['user'] | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: StaffState = {
  currentStaff: JSON.parse(localStorage.getItem('staffUser') || 'null'),
  token: localStorage.getItem('staffToken'),
  loading: false,
  error: null,
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
      });
  },
});

export const { staffLogout, setStaffFromStorage } = staffSlice.actions;
export default staffSlice.reducer;
