import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { GuestRegisterData, GuestLoginData, Guest, AuthResponse } from '../API/guestAPI';
import { registerGuest, loginGuest } from '../API/guestAPI';

interface GuestState {
  currentGuest: Guest | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: GuestState = {
  currentGuest: null,
  token: null,
  loading: false,
  error: null,
};

export const registerGuestThunk = createAsyncThunk<AuthResponse, GuestRegisterData>(
  'guest/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await registerGuest(data);

      if (res.status >= 400) {
        // Reject if status is error (e.g., 400, 409, 500)
        return rejectWithValue('Registration failed! this email is already taken');
      }

      // Otherwise, success
      return res.data;
    } catch (err: any) {
      return rejectWithValue('Registration failed!');
    }
  }
);

export const loginGuestThunk = createAsyncThunk<AuthResponse, GuestLoginData>(
  'guest/login',
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginGuest(data);
      if (res.message) throw new Error(res.message);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const guestSlice = createSlice({
  name: 'guest',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentGuest = null;
      state.token = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(registerGuestThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerGuestThunk.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
      state.loading = false;
      state.currentGuest = action.payload.guest || null;
      state.token = action.payload.token || null;
    });
    builder.addCase(registerGuestThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(loginGuestThunk.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginGuestThunk.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
      state.loading = false;
      state.currentGuest = action.payload.guest || null;
      state.token = action.payload.token || null;
    });
    builder.addCase(loginGuestThunk.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout } = guestSlice.actions;
export default guestSlice.reducer;
