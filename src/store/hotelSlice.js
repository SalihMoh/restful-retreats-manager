
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/axios';

const initialState = {
  hotels: [],
  status: 'idle',
  error: null,
};

export const fetchHotels = createAsyncThunk('hotels/fetchHotels', async () => {
  const response = await api.get('/hotels');
  return response.data;
});

export const addHotel = createAsyncThunk('hotels/addHotel', async (hotelData) => {
  const formData = new FormData();
  Object.keys(hotelData).forEach(key => {
    if (key === 'image' && hotelData[key] instanceof File) {
      formData.append('image', hotelData[key]);
    } else if (key === 'amenities') {
      formData.append('amenities', JSON.stringify(hotelData[key]));
    } else {
      formData.append(key, hotelData[key]);
    }
  });
  
  const response = await api.post('/hotels', formData);
  return response.data;
});

export const updateHotel = createAsyncThunk('hotels/updateHotel', async ({ id, ...hotelData }) => {
  const formData = new FormData();
  Object.keys(hotelData).forEach(key => {
    if (key === 'image' && hotelData[key] instanceof File) {
      formData.append('image', hotelData[key]);
    } else if (key === 'amenities') {
      formData.append('amenities', JSON.stringify(hotelData[key]));
    } else {
      formData.append(key, hotelData[key]);
    }
  });
  
  const response = await api.put(`/hotels/${id}`, formData);
  return response.data;
});

export const deleteHotel = createAsyncThunk('hotels/deleteHotel', async (id) => {
  await api.delete(`/hotels/${id}`);
  return id;
});

const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.hotels = action.payload;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch hotels';
      })
      .addCase(addHotel.fulfilled, (state, action) => {
        state.hotels.push(action.payload);
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        const index = state.hotels.findIndex((h) => h.id === action.payload.id);
        if (index !== -1) {
          state.hotels[index] = action.payload;
        }
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.hotels = state.hotels.filter((h) => h.id !== action.payload);
      });
  },
});

export default hotelSlice.reducer;
