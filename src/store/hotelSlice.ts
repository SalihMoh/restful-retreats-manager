
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api from '../lib/axios';
import { Hotel } from '@/types/hotel';

interface HotelState {
  hotels: Hotel[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: HotelState = {
  hotels: [],
  status: 'idle',
  error: null,
};

export const fetchHotels = createAsyncThunk(
  'hotels/fetchHotels', 
  async () => {
    const response = await api.get('/hotels');
    return response.data;
  }
);

interface HotelFormData {
  id?: number;
  name: string;
  location: string;
  price: number;
  rating: number;
  description: string;
  image?: File;
  availableRooms: number;
  amenities: string[];
}

export const addHotel = createAsyncThunk(
  'hotels/addHotel', 
  async (hotelData: HotelFormData) => {
    const formData = new FormData();
    Object.keys(hotelData).forEach(key => {
      if (key === 'image' && hotelData.image instanceof File) {
        formData.append('image', hotelData.image);
      } else if (key === 'amenities') {
        formData.append('amenities', JSON.stringify(hotelData.amenities));
      } else {
        formData.append(key, String(hotelData[key as keyof HotelFormData]));
      }
    });
    
    const response = await api.post('/hotels', formData);
    return response.data;
  }
);

export const updateHotel = createAsyncThunk(
  'hotels/updateHotel', 
  async ({ id, ...hotelData }: HotelFormData) => {
    const formData = new FormData();
    Object.keys(hotelData).forEach(key => {
      if (key === 'image' && hotelData.image instanceof File) {
        formData.append('image', hotelData.image);
      } else if (key === 'amenities') {
        formData.append('amenities', JSON.stringify(hotelData.amenities));
      } else {
        formData.append(key, String(hotelData[key as keyof Omit<HotelFormData, 'id'>]));
      }
    });
    
    const response = await api.put(`/hotels/${id}`, formData);
    return response.data;
  }
);

export const deleteHotel = createAsyncThunk(
  'hotels/deleteHotel', 
  async (id: number) => {
    await api.delete(`/hotels/${id}`);
    return id;
  }
);

const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHotels.fulfilled, (state, action: PayloadAction<Hotel[]>) => {
        state.status = 'succeeded';
        state.hotels = action.payload;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch hotels';
      })
      .addCase(addHotel.fulfilled, (state, action: PayloadAction<Hotel>) => {
        state.hotels.push(action.payload);
      })
      .addCase(updateHotel.fulfilled, (state, action: PayloadAction<Hotel>) => {
        const index = state.hotels.findIndex((h) => h.id === action.payload.id);
        if (index !== -1) {
          state.hotels[index] = action.payload;
        }
      })
      .addCase(deleteHotel.fulfilled, (state, action: PayloadAction<number>) => {
        state.hotels = state.hotels.filter((h) => h.id !== action.payload);
      });
  },
});

export default hotelSlice.reducer;
