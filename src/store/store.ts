
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import hotelReducer from './hotelSlice';
import bookingReducer from './bookingSlice';
import userReducer from './userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    hotels: hotelReducer,
    bookings: bookingReducer,
    users: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
