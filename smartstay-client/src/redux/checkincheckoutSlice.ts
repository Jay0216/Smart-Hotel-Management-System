import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import {
  performCheckAction,
  fetchCheckLogsByBooking,
  type CheckActionResponse,
  type CheckLog,
  type CheckActionPayload,
} from '../API/checkincheckoutAPI';

/* ===================== STATE ===================== */

interface CheckinCheckoutState {
  loading: boolean;
  error: string | null;
  success: boolean;
  lastAction: CheckActionResponse['result'] | null;
  logs: CheckLog[];
}

const initialState: CheckinCheckoutState = {
  loading: false,
  error: null,
  success: false,
  lastAction: null,
  logs: []
};

/* ===================== THUNKS ===================== */

export const checkActionThunk = createAsyncThunk<
  CheckActionResponse['result'],
  CheckActionPayload,
  { rejectValue: string }
>(
  'checkinCheckout/action',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await performCheckAction(payload);
      return res.result;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCheckLogsThunk = createAsyncThunk<
  CheckLog[],
  number,
  { rejectValue: string }
>(
  'checkinCheckout/fetchLogs',
  async (bookingId, { rejectWithValue }) => {
    try {
      return await fetchCheckLogsByBooking(bookingId);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

/* ===================== SLICE ===================== */

const checkinCheckoutSlice = createSlice({
  name: 'checkinCheckout',
  initialState,
  reducers: {
    clearCheckStatus: (state) => {
      state.error = null;
      state.success = false;
      state.lastAction = null;
    }
  },
  extraReducers: (builder) => {
    builder
      /* CHECK ACTION */
      .addCase(checkActionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        checkActionThunk.fulfilled,
        (state, action: PayloadAction<CheckActionResponse['result']>) => {
          state.loading = false;
          state.success = true;
          state.lastAction = action.payload;
        }
      )
      .addCase(checkActionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Check action failed';
      })

      /* FETCH LOGS */
      .addCase(fetchCheckLogsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchCheckLogsThunk.fulfilled,
        (state, action: PayloadAction<CheckLog[]>) => {
          state.loading = false;
          state.logs = action.payload;
        }
      )
      .addCase(fetchCheckLogsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load logs';
      });
  }
});

export const { clearCheckStatus } = checkinCheckoutSlice.actions;

export default checkinCheckoutSlice.reducer;
