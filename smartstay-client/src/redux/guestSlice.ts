import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { registerGuest, loginGuest } from '../API/guestAPI';
import type { GuestRegisterData, GuestLoginData, Guest, AuthResponse } from '../API/guestAPI';

interface GuestState {
  currentGuest: Guest | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: GuestState = {
  currentGuest: JSON.parse(localStorage.getItem('guestUser') || 'null'),
  token: localStorage.getItem('guestToken'),
  loading: false,
  error: null,
};

// ---- Thunks ----
export const registerGuestThunk = createAsyncThunk<{ message: string }, GuestRegisterData>(
  'guest/register',
  async (data, { rejectWithValue }) => {
    try {
      const res = await registerGuest(data);
      if (res.status >= 400) {
        return rejectWithValue('Registration failed! This email is already taken.');
      }
      return { message: 'Account created successfully! Please login.' }; // <-- return message
    } catch (err: any) {
      return rejectWithValue(err.message || 'Guest registration failed');
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
      return rejectWithValue(err.message || 'Guest login failed');
    }
  }
);

// ---- Slice ----
const guestSlice = createSlice({
  name: 'guest',
  initialState,
  reducers: {
    guestLogout: (state) => {
      state.currentGuest = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem('guestToken');
      localStorage.removeItem('guestUser');
    },
    setGuestFromStorage: (state, action: PayloadAction<{ guest: Guest; token: string }>) => {
      state.currentGuest = action.payload.guest;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(registerGuestThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerGuestThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerGuestThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // LOGIN
      .addCase(loginGuestThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginGuestThunk.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.currentGuest = action.payload.guest || null;
        state.token = action.payload.token || null;

        localStorage.setItem('guestToken', action.payload.token || '');
          localStorage.setItem(
            'guestUser',
            JSON.stringify(action.payload.guest)
          );
      })
      .addCase(loginGuestThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { guestLogout, setGuestFromStorage } = guestSlice.actions;
export default guestSlice.reducer;
