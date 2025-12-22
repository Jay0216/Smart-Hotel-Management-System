import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { registerAdmin, loginAdmin } from '../API/adminAPI';

// ====== Types ======
interface AdminRegisterResponse {
  message: string;
  user: {
    admin_id: string;
    first_name: string;
    last_name: string;
    email: string;
    image_url: string | null;
  };
}

interface AdminLoginResponse {
  token: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: 'admin';
    imageUrl: string | null;
  };
}

interface AdminState {
  currentAdmin: AdminLoginResponse['user'] | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// ====== Initial State ======
const initialState: AdminState = {
  currentAdmin: null,
  token: null,
  loading: false,
  error: null,
};

// ====== Async Thunks ======
export const adminRegisterThunk = createAsyncThunk<AdminRegisterResponse, {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  imageUrl?: string;
}>(
  'admin/register',
  async (data, { rejectWithValue }) => {
    try {
      return await registerAdmin(data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Admin registration failed');
    }
  }
);

export const adminLoginThunk = createAsyncThunk<AdminLoginResponse, {
  email: string;
  password: string;
}>(
  'admin/login',
  async (data, { rejectWithValue }) => {
    try {
      return await loginAdmin(data);
    } catch (err: any) {
      return rejectWithValue(err.message || 'Admin login failed');
    }
  }
);

// ====== Slice ======
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
      .addCase(adminRegisterThunk.fulfilled, (state, action: PayloadAction<AdminRegisterResponse>) => {
        state.loading = false;
        // Optionally you can set currentAdmin after registration
        state.currentAdmin = {
          id: action.payload.user.admin_id,
          firstName: action.payload.user.first_name,
          lastName: action.payload.user.last_name,
          email: action.payload.user.email,
          role: 'admin',
          imageUrl: action.payload.user.image_url,
        };
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
      .addCase(adminLoginThunk.fulfilled, (state, action: PayloadAction<AdminLoginResponse>) => {
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

