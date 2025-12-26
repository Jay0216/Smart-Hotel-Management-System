import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from '@reduxjs/toolkit';
import {
  createServiceRequestAPI,
  getGuestServiceRequestsAPI,
  getBranchServiceRequestsAPI,
  updateServiceRequestStatusAPI
} from "../API/serviceRequestAPI";

import type {
  CreateServiceRequestInput,
  ServiceRequest,
  ServiceRequestStatus
} from "../API/serviceRequestAPI";

/* ================== STATE TYPE ================== */

interface ServiceRequestState {
  requests: ServiceRequest[];
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ServiceRequestState = {
  requests: [],
  loading: false,
  error: null,
  success: false
};

/* ================== THUNKS ================== */

// CREATE
export const createServiceRequest = createAsyncThunk<
  ServiceRequest,
  CreateServiceRequestInput,
  { rejectValue: string }
>(
  "serviceRequests/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await createServiceRequestAPI(data);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// FETCH BY GUEST
export const fetchGuestServiceRequests = createAsyncThunk<
  ServiceRequest[],
  string,
  { rejectValue: string }
>(
  "serviceRequests/fetchGuest",
  async (guestId, { rejectWithValue }) => {
    try {
      const response = await getGuestServiceRequestsAPI(guestId);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// FETCH BY BRANCH
export const fetchBranchServiceRequests = createAsyncThunk<
  ServiceRequest[],
  number,
  { rejectValue: string }
>(
  "serviceRequests/fetchBranch",
  async (branchId, { rejectWithValue }) => {
    try {
      const response = await getBranchServiceRequestsAPI(branchId);
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// UPDATE STATUS
export const updateServiceRequestStatus = createAsyncThunk<
  ServiceRequest,
  { requestId: number; status: ServiceRequestStatus },
  { rejectValue: string }
>(
  "serviceRequests/updateStatus",
  async ({ requestId, status }, { rejectWithValue }) => {
    try {
      const response = await updateServiceRequestStatusAPI({
        requestId,
        status
      });
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

/* ================== SLICE ================== */

const serviceRequestSlice = createSlice({
  name: "serviceRequests",
  initialState,
  reducers: {
    clearServiceRequestState: (state) => {
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder

      /* ===== CREATE ===== */
      .addCase(createServiceRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        createServiceRequest.fulfilled,
        (state, action: PayloadAction<ServiceRequest>) => {
          state.loading = false;
          state.success = true;
          state.requests.unshift(action.payload);
        }
      )
      .addCase(createServiceRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create request";
      })

      /* ===== FETCH GUEST ===== */
      .addCase(fetchGuestServiceRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchGuestServiceRequests.fulfilled,
        (state, action: PayloadAction<ServiceRequest[]>) => {
          state.loading = false;
          state.requests = action.payload;
        }
      )
      .addCase(fetchGuestServiceRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch requests";
      })

      /* ===== FETCH BRANCH ===== */
      .addCase(
        fetchBranchServiceRequests.fulfilled,
        (state, action: PayloadAction<ServiceRequest[]>) => {
          state.requests = action.payload;
        }
      )

      /* ===== UPDATE STATUS ===== */
      .addCase(
        updateServiceRequestStatus.fulfilled,
        (state, action: PayloadAction<ServiceRequest>) => {
          const index = state.requests.findIndex(
            (r) => r.request_id === action.payload.request_id
          );

          if (index !== -1) {
            state.requests[index] = action.payload;
          }
        }
      );
  }
});

/* ================== EXPORTS ================== */

export const { clearServiceRequestState } =
  serviceRequestSlice.actions;

export default serviceRequestSlice.reducer;

