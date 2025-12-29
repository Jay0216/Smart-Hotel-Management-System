import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { BookingPayload, BookingResponse } from '../API/bookingAPI';
import * as bookingAPI from '../API/bookingAPI';

interface BookingState {
  currentBooking: BookingResponse | null;
  guestBookings: BookingResponse[];
  allBookings: BookingResponse[],
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: BookingState = {
  currentBooking: null,
  guestBookings: [],
  allBookings: [],
  status: 'idle',
  error: null,
};

// Create a new booking
export const addBooking = createAsyncThunk(
  'booking/addBooking',
  async (payload: BookingPayload, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.createBooking(payload);
      return response; // BookingResponse
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Fetch single booking by ID
export const fetchBooking = createAsyncThunk(
  'booking/fetchBooking',
  async (bookingId: number, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.getBookingById(bookingId);
      return response; // BookingResponse
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Fetch all bookings for a specific guest
export const fetchGuestBookings = createAsyncThunk(
  'booking/fetchGuestBookings',
  async (guestId: string, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.getBookingsByGuestId(guestId);
      return response; // BookingResponse[]
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchAllBookings = createAsyncThunk(
  'booking/fetchAllBookings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookingAPI.getAllBookings();
      return response; // BookingResponse[]
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    clearBooking: (state) => {
      state.currentBooking = null;
      state.guestBookings = [];
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Booking
      .addCase(addBooking.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentBooking = action.payload;
      })
      .addCase(addBooking.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Fetch single booking
      .addCase(fetchBooking.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchBooking.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentBooking = action.payload;
      })
      .addCase(fetchBooking.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Fetch guest-specific bookings
      .addCase(fetchGuestBookings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchGuestBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.guestBookings = action.payload; // BookingResponse[]
      })
      .addCase(fetchGuestBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      .addCase(fetchAllBookings.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.allBookings = action.payload;
      })
     .addCase(fetchAllBookings.rejected, (state, action) => {
      state.status = 'failed';
      state.error = action.payload as string;
     });
  },
});

export const { clearBooking } = bookingSlice.actions;
export default bookingSlice.reducer;
