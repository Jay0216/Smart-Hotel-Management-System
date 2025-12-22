// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import guestReducer from './guestSlice';
import adminReducer from './adminSlice';
import receptionistReducer from './receptionSlice';
import staffReducer from './staffSlice';
import roomReducer from './roomSlice'; // ✅ import roomSlice
import serviceReducer from './serviceSlice';
import fetchAllStaffUsersReducer from './allStaffUsersSlice';

export const store = configureStore({
  reducer: {
    guest: guestReducer,
    admin: adminReducer,
    receptionist: receptionistReducer,
    staff: staffReducer,
    rooms: roomReducer,
    services: serviceReducer,
    allstaff: fetchAllStaffUsersReducer,
  },
});

// TypeScript types for hooks
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
