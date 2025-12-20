import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import * as serviceAPI from '../API/serviceAPI';

interface ServiceState {
  services: serviceAPI.Service[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceState = {
  services: [],
  loading: false,
  error: null,
};

// Async thunk to add a service
export const addServiceAsync = createAsyncThunk(
  'services/addService',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await serviceAPI.addService(formData);
      return response.service;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to add service');
    }
  }
);

// Async thunk to fetch services
export const fetchServicesAsync = createAsyncThunk(
  'services/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const services = await serviceAPI.getServices();
      return services;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch services');
    }
  }
);

const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Add service
      .addCase(addServiceAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addServiceAsync.fulfilled, (state, action: PayloadAction<serviceAPI.Service>) => {
        state.loading = false;
        state.services.push(action.payload);
      })
      .addCase(addServiceAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch services
      .addCase(fetchServicesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServicesAsync.fulfilled, (state, action: PayloadAction<serviceAPI.Service[]>) => {
        state.loading = false;
        state.services = action.payload;
      })
      .addCase(fetchServicesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default serviceSlice.reducer;
