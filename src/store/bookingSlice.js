
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/axios';

const initialState = {
  bookings: [],
  status: 'idle',
  error: null,
};

export const fetchUserBookings = createAsyncThunk(
  'bookings/fetchUserBookings',
  async (userId) => {
    const response = await api.get(`/bookings?userId=${userId}`);
    return response.data;
  }
);

export const createBooking = createAsyncThunk(
  'bookings/createBooking',
  async (bookingData) => {
    const newBooking = {
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString().split('T')[0],
      id: Date.now(),
    };
    const response = await api.post('/bookings', newBooking);
    return response.data;
  }
);

const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserBookings.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserBookings.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.bookings = action.payload;
      })
      .addCase(fetchUserBookings.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch bookings';
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload);
      });
  },
});

export default bookingSlice.reducer;
