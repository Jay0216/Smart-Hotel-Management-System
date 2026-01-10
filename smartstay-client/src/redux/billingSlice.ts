import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getBillingSummaryByGuestAPI } from '../API/billingAPI';

export interface BillingState {
  data: {
    bookingId: number; 
    branch: string;
    roomCharges: number;
    serviceCharges: number;
    taxRate: number;
    taxAmount: number;
    total: number;
  } | null;
  loading: boolean;
  error: string | null;
}

const initialState: BillingState = {
  data: null,
  loading: false,
  error: null
};

export const fetchBillingSummaryThunk = createAsyncThunk(
  'billing/fetchSummary',
  async (guestId: string | number, { rejectWithValue }) => {
    try {
      return await getBillingSummaryByGuestAPI(guestId);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch billing summary'
      );
    }
  }
);

const billingSlice = createSlice({
  name: 'billing',
  initialState,
  reducers: {
    clearBillingSummary: (state) => {
      state.data = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillingSummaryThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBillingSummaryThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBillingSummaryThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearBillingSummary } = billingSlice.actions;
export default billingSlice.reducer;
