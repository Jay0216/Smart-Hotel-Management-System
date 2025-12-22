import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { registerReceptionist, loginReceptionist } from '../API/receptionistAPI';
import type { RegisterPayload, LoginPayload, AuthResponse } from '../API/hotelStaffAuthTypes';

interface ReceptionistState {
  currentReceptionist: AuthResponse['user'] | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReceptionistState = {
  currentReceptionist: JSON.parse(localStorage.getItem('receptionistUser') || 'null'),
  token: localStorage.getItem('receptionistToken'),
  loading: false,
  error: null,
};

// ---- Thunks ----
export const receptionistRegisterThunk = createAsyncThunk<void, RegisterPayload>(
  'receptionist/register',
  async (data, { rejectWithValue }) => {
    try {
      await registerReceptionist(data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Receptionist registration failed');
    }
  }
);

export const receptionistLoginThunk = createAsyncThunk<AuthResponse, LoginPayload>(
  'receptionist/login',
  async (data, { rejectWithValue }) => {
    try {
      return await loginReceptionist(data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Receptionist login failed');
    }
  }
);

// ---- Slice ----
const receptionistSlice = createSlice({
  name: 'receptionist',
  initialState,
  reducers: {
    receptionistLogout: (state) => {
      state.currentReceptionist = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      localStorage.removeItem('receptionistToken');
      localStorage.removeItem('receptionistUser');
    },
    setReceptionistFromStorage: (
      state,
      action: PayloadAction<{ user: AuthResponse['user']; token: string }>
    ) => {
      state.currentReceptionist = action.payload.user;
      state.token = action.payload.token;
    },
  },
  extraReducers: (builder) => {
    builder
      // REGISTER
      .addCase(receptionistRegisterThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(receptionistRegisterThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(receptionistRegisterThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // LOGIN
      .addCase(receptionistLoginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        receptionistLoginThunk.fulfilled,
        (state, action: PayloadAction<AuthResponse>) => {
          state.loading = false;
          state.currentReceptionist = action.payload.user;
          state.token = action.payload.token;

          // Store in localStorage
          localStorage.setItem('receptionistToken', action.payload.token);
          localStorage.setItem(
            'receptionistUser',
            JSON.stringify(action.payload.user)
          );
        }
      )
      .addCase(receptionistLoginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { receptionistLogout, setReceptionistFromStorage } =
  receptionistSlice.actions;
export default receptionistSlice.reducer;

