import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { simulatePaymentAPI, simulateReceptionistPaymentAPI } from "../API/paymentAPI";
import type {
  Payment,
  SimulatePaymentRequest,
  SimulateReceptionistPaymentRequest
} from "../API/paymentTypes";

interface PaymentState {
  currentPayment: Payment | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  currentPayment: null,
  loading: false,
  error: null
};

export const simulatePayment = createAsyncThunk(
  "payment/simulate",
  async (payload: SimulatePaymentRequest, thunkAPI) => {
    try {
      const response = await simulatePaymentAPI(payload);
      return response.payment;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

export const simulateReceptionistPayment = createAsyncThunk(
  "payment/simulatereceptionist",
  async (payload: SimulateReceptionistPaymentRequest, thunkAPI) => {
    try {
      const response = await simulateReceptionistPaymentAPI(payload);
      return response.payment;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(err.message);
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPayment(state) {
      state.currentPayment = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(simulatePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(simulatePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
      })
      .addCase(simulatePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(simulateReceptionistPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(simulateReceptionistPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPayment = action.payload;
      })
      .addCase(simulateReceptionistPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
