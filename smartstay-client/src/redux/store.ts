// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import guestReducer from './guestSlice';
import adminReducer from './adminSlice';
import receptionistReducer from './receptionSlice';
import staffReducer from './staffSlice';
import roomReducer from './roomSlice'; // ✅ import roomSlice
import serviceReducer from './serviceSlice';
import fetchAllStaffUsersReducer from './allStaffUsersSlice';
import bookingReducer from './bookingSlice';
import paymentReducer from "./paymentSlice";
import serviceRequestReducer from './serviceRequestSlice'; // ✅ import serviceRequestSlice
import staffTasksReducer from './staffTasksSlice'; // ✅ import staffTasksSlice
import checkinCheckoutReducer from './checkincheckoutSlice'; // ✅ import checkincheckoutSlice
import billingReducer from './billingSlice'; // ✅ import billingSlice

export const store = configureStore({
  reducer: {
    guest: guestReducer,
    admin: adminReducer,
    receptionist: receptionistReducer,
    staff: staffReducer,
    rooms: roomReducer,
    services: serviceReducer,
    allstaff: fetchAllStaffUsersReducer,
    booking: bookingReducer,
    payment: paymentReducer,
    serviceRequests: serviceRequestReducer,
    staffTasks: staffTasksReducer,
    checkinCheckout: checkinCheckoutReducer,
    billing: billingReducer,
  },
});

// TypeScript types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
