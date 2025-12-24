import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { simulatePaymentAPI } from "../API/paymentAPI";
import type {
  Payment,
  SimulatePaymentRequest
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
      });
  }
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
