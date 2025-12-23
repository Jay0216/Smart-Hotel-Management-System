import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { BookingPayload, BookingResponse } from '../API/bookingAPI';
import * as bookingAPI from '../API/bookingAPI';

interface BookingState {
  currentBooking: BookingResponse | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BookingState = {
  currentBooking: null,
  status: 'idle',
  error: null,
};

// Async thunks
export const addBooking = createAsyncThunk(
  'booking/addBooking',
  async (payload: BookingPayload, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.createBooking(payload);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchBooking = createAsyncThunk(
  'booking/fetchBooking',
  async (bookingId: number, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.getBookingById(bookingId);
      return response;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Slice
const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearBooking: (state) => {
      state.currentBooking = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBooking.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addBooking.fulfilled, (state, action: PayloadAction<BookingResponse>) => {
        state.status = 'succeeded';
        state.currentBooking = action.payload;
      })
      .addCase(addBooking.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchBooking.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooking.fulfilled, (state, action: PayloadAction<BookingResponse>) => {
        state.status = 'succeeded';
        state.currentBooking = action.payload;
      })
      .addCase(fetchBooking.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
