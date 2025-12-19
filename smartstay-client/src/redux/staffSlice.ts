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
  currentStaff: null,
  token: null,
  loading: false,
  error: null,
};

export const staffRegisterThunk = createAsyncThunk<void, RegisterPayload>(
  'staff/register',
  async (data, { rejectWithValue }) => {
    try {
      await registerStaff(data); // ⬅️ ignore response
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

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    staffLogout: (state) => {
      state.currentStaff = null;
      state.token = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER (NO LOGIN)
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

      // LOGIN (ONLY PLACE WE AUTH)
      .addCase(staffLoginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(staffLoginThunk.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.currentStaff = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(staffLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { staffLogout } = staffSlice.actions;
export default staffSlice.reducer;
