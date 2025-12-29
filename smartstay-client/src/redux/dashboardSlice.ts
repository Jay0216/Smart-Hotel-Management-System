import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DashboardAPI } from "../API/dashboardAPI";

interface ChartData {
  labels: string[];
  data: number[];
}

interface DashboardState {
  occupancy: ChartData;
  revenue: ChartData;
  bookingTrends: ChartData;
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  occupancy: { labels: [], data: [] },
  revenue: { labels: [], data: [] },
  bookingTrends: { labels: [], data: [] },
  loading: false,
  error: null,
};

// Async thunks
export const fetchOccupancy = createAsyncThunk("dashboard/fetchOccupancy", async () => {
  return await DashboardAPI.fetchOccupancy();
});

export const fetchRevenue = createAsyncThunk("dashboard/fetchRevenue", async () => {
  return await DashboardAPI.fetchRevenue();
});

export const fetchBookingTrends = createAsyncThunk("dashboard/fetchBookingTrends", async () => {
  return await DashboardAPI.fetchBookingTrends();
});

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Occupancy
      .addCase(fetchOccupancy.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchOccupancy.fulfilled, (state, action) => {
        state.loading = false;
        state.occupancy = action.payload;
      })
      .addCase(fetchOccupancy.rejected, (state, action) => { state.loading = false; state.error = action.error.message || null; })

      // Revenue
      .addCase(fetchRevenue.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.revenue = action.payload;
      })
      .addCase(fetchRevenue.rejected, (state, action) => { state.loading = false; state.error = action.error.message || null; })

      // Booking Trends
      .addCase(fetchBookingTrends.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchBookingTrends.fulfilled, (state, action) => {
        state.loading = false;
        state.bookingTrends = action.payload;
      })
      .addCase(fetchBookingTrends.rejected, (state, action) => { state.loading = false; state.error = action.error.message || null; });
  }
});

export default dashboardSlice.reducer;
