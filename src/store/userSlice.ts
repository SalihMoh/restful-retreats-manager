
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../lib/axios';
import { User } from '@/types/user';

interface UserState {
  users: User[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  users: [],
  status: 'idle',
  error: null,
};

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const response = await api.get('/users');
  return response.data;
});

export const addUser = createAsyncThunk('users/addUser', 
  async (userData: Omit<User, 'id'>) => {
    const response = await api.post('/users', userData);
    return response.data;
});

export const updateUser = createAsyncThunk('users/updateUser',
  async ({ id, ...userData }: User) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
});

export const deleteUser = createAsyncThunk('users/deleteUser',
  async (id: number) => {
    await api.delete(`/users/${id}`);
    return id;
});

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(u => u.id !== action.payload);
      });
  },
});

export default userSlice.reducer;
