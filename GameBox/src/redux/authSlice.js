// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api';

const API_URL = 'http://localhost:8000/auth';

const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

const initialState = {
  user: user || null,
  token: token || null,
  isAuthenticated: !!token,
  status: 'idle',
  error: null,
};

// REGISTRO
export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Erro desconhecido ao registrar.';
      return rejectWithValue({ message });
    }
  }
);

// LOGIN
export const login = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_URL}/login`, userData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Erro desconhecido ao fazer login.';
      return rejectWithValue({ message });
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload?.message ||
          action.error?.message ||
          'Erro ao fazer login.';
      })

      // REGISTRO
      .addCase(register.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(register.fulfilled, (state) => {
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed';
        state.error =
          action.payload?.message ||
          action.error?.message ||
          'Erro ao registrar.';
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
