import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { registerAdmin, loginAdmin } from '../API/adminAPI';
import type { RegisterPayload, LoginPayload, AuthResponse } from '../API/hotelStaffAuthTypes';

interface AdminState {
  currentAdmin: AuthResponse['user'] | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  currentAdmin: null,
  token: null,
  loading: false,
  error: null,
};

export const adminRegisterThunk = createAsyncThunk<AuthResponse, RegisterPayload>(
  'admin/register',
  async (data, { rejectWithValue }) => {
    try {
      return await registerAdmin(data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Admin registration failed');
    }
  }
);

export const adminLoginThunk = createAsyncThunk<AuthResponse, LoginPayload>(
  'admin/login',
  async (data, { rejectWithValue }) => {
    try {
      return await loginAdmin(data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Admin login failed');
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    adminLogout: (state) => {
      state.currentAdmin = null;
      state.token = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(adminRegisterThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminRegisterThunk.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.currentAdmin = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(adminRegisterThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // LOGIN
      .addCase(adminLoginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLoginThunk.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.currentAdmin = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(adminLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { adminLogout } = adminSlice.actions;
export default adminSlice.reducer;
