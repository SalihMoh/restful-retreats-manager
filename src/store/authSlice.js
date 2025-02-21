
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/axios';

const initialState = {
  user: null,
  status: 'idle',
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }) => {
    const response = await api.get(`/users?email=${email}&password=${password}`);
    if (response.data.length === 0) {
      throw new Error('Invalid credentials');
    }
    return response.data[0];
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password }) => {
    const response = await api.post('/users', {
      name,
      email,
      password,
      role: 'user'
    });
    return response.data;
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded';
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Registration failed';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
