
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/axios';
import { Hotel, HotelFilters } from '@/types/hotel';

interface HotelState {
  hotels: Hotel[];
  filteredHotels: Hotel[];
  filters: HotelFilters;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  selectedHotel: Hotel | null;
}

const initialState: HotelState = {
  hotels: [],
  filteredHotels: [],
  filters: {
    priceRange: [0, 1000],
    rating: undefined,
    amenities: undefined,
    location: undefined,
    dates: undefined,
    guestCount: undefined
  },
  status: 'idle',
  error: null,
  selectedHotel: null
};

export const fetchHotels = createAsyncThunk('hotels/fetchHotels', async () => {
  const response = await api.get('/hotels');
  return response.data;
});

export const addHotel = createAsyncThunk('hotels/addHotel', async (hotelData: Omit<Hotel, 'id'>) => {
  const formData = new FormData();
  Object.entries(hotelData).forEach(([key, value]) => {
    if (key === 'amenities') {
      formData.append(key, JSON.stringify(value));
    } else if (key === 'image' && value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });
  
  const response = await api.post('/hotels', formData);
  return response.data;
});

export const updateHotel = createAsyncThunk('hotels/updateHotel', async (hotel: Hotel) => {
  const formData = new FormData();
  Object.entries(hotel).forEach(([key, value]) => {
    if (key === 'amenities') {
      formData.append(key, JSON.stringify(value));
    } else if (key === 'image' && value instanceof File) {
      formData.append(key, value);
    } else {
      formData.append(key, String(value));
    }
  });
  
  const response = await api.put(`/hotels/${hotel.id}`, formData);
  return response.data;
});

export const deleteHotel = createAsyncThunk('hotels/deleteHotel', async (id: number) => {
  await api.delete(`/hotels/${id}`);
  return id;
});

export const applyFilters = createAsyncThunk(
  'hotels/applyFilters',
  async (filters: HotelFilters, { getState }) => {
    const { hotels } = getState() as { hotels: HotelState };
    return hotels.hotels.filter(hotel => {
      const matchesPrice = hotel.price >= filters.priceRange[0] && 
                          hotel.price <= filters.priceRange[1];
      const matchesRating = !filters.rating || hotel.rating >= filters.rating;
      const matchesAmenities = !filters.amenities?.length || 
                              filters.amenities.every(a => hotel.amenities.includes(a));
      const matchesLocation = !filters.location || 
                             hotel.location.toLowerCase().includes(filters.location.toLowerCase());
      
      return matchesPrice && matchesRating && matchesAmenities && matchesLocation;
    });
  }
);

const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
    selectHotel: (state, action) => {
      state.selectedHotel = action.payload;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredHotels = state.hotels;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.hotels = action.payload;
        state.filteredHotels = action.payload;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch hotels';
      })
      .addCase(addHotel.fulfilled, (state, action) => {
        state.hotels.push(action.payload);
        state.filteredHotels = state.hotels;
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        const index = state.hotels.findIndex((h) => h.id === action.payload.id);
        if (index !== -1) {
          state.hotels[index] = action.payload;
          state.filteredHotels = state.hotels;
        }
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.hotels = state.hotels.filter((h) => h.id !== action.payload);
        state.filteredHotels = state.hotels;
      })
      .addCase(applyFilters.fulfilled, (state, action) => {
        state.filteredHotels = action.payload;
      });
  },
});

export const { setFilters, selectHotel, clearFilters } = hotelSlice.actions;
export default hotelSlice.reducer;
