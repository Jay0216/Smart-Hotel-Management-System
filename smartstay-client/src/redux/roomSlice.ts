import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import * as roomAPI from '../API/roomsAPI';

interface RoomState {
  rooms: roomAPI.Room[];
  loading: boolean;
  error: string | null;
}

const initialState: RoomState = {
  rooms: [],
  loading: false,
  error: null,
};

export const addRoomAsync = createAsyncThunk(
  'rooms/addRoom',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await roomAPI.addRoom(formData);
      return response.room;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to add room');
    }
  }
);

export const fetchRoomsAsync = createAsyncThunk(
  'rooms/fetchRooms',
  async (_, { rejectWithValue }) => {
    try {
      const rooms = await roomAPI.getRooms();
      return rooms;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Failed to fetch rooms');
    }
  }
);

const roomSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addRoomAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addRoomAsync.fulfilled, (state, action: PayloadAction<roomAPI.Room>) => {
        state.loading = false;
        state.rooms.push(action.payload);
      })
      .addCase(addRoomAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRoomsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoomsAsync.fulfilled, (state, action: PayloadAction<roomAPI.Room[]>) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRoomsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default roomSlice.reducer;
