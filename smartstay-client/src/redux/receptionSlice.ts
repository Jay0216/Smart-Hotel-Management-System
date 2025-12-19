import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { loginReceptionist, registerReceptionist } from '../API/receptionistAPI';
import type { AuthResponse, RegisterPayload, LoginPayload } from '../API/hotelStaffAuthTypes';

interface AuthState {
  user: AuthResponse['user'] | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

export const receptionistRegisterThunk = createAsyncThunk<AuthResponse, RegisterPayload>(
  'receptionist/register',
  async (data, { rejectWithValue }) => {
    try {
      return await registerReceptionist(data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Registration failed');
    }
  }
);

export const receptionistLoginThunk = createAsyncThunk<AuthResponse, LoginPayload>(
  'receptionist/login',
  async (data, { rejectWithValue }) => {
    try {
      return await loginReceptionist(data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Login failed');
    }
  }
);

const receptionistSlice = createSlice({
  name: 'receptionist',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(receptionistLoginThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(receptionistLoginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(receptionistLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = receptionistSlice.actions;
export default receptionistSlice.reducer;
