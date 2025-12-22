import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { StaffUser } from '../API/allStaffUsersAPI';
import { fetchAllStaffUsers } from '../API/allStaffUsersAPI';

interface AllStaffUsersState {
  users: StaffUser[];
  loading: boolean;
  error: string | null;
}

const initialState: AllStaffUsersState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchAllStaffUsersThunk = createAsyncThunk(
  'allStaffUsers/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchAllStaffUsers();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const allStaffUsersSlice = createSlice({
  name: 'allStaffUsers',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchAllStaffUsersThunk.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllStaffUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllStaffUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.users = [];
      });
  },
});

export default allStaffUsersSlice.reducer;
