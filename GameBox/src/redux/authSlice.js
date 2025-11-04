// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/auth'; // API de Autenticação

// Guarda o token e o usuário no localStorage (para o login "lembrar" após F5)
const user = JSON.parse(localStorage.getItem('user'));
const token = localStorage.getItem('token');

const initialState = {
    user: user ? user : null,
    token: token ? token : null,
    isAuthenticated: token ? true : false,
    status: 'idle',
    error: null,
};

// Ação Assíncrona: REGISTRAR
export const register = createAsyncThunk('auth/register', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

// Ação Assíncrona: LOGAR
export const login = createAsyncThunk('auth/login', async (userData, { rejectWithValue }) => {
    try {
        const response = await axios.post(`${API_URL}/login`, userData);
        // Salva no localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data; // { token, user: {...} }
    } catch (err) {
        return rejectWithValue(err.response.data);
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    // Ação Síncrona: LOGOUT
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.status = 'idle';
        }
    },
    extraReducers: (builder) => {
        builder
            // Casos de Login
            .addCase(login.pending, (state) => { state.status = 'loading'; })
            .addCase(login.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.isAuthenticated = true;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            })
            // Casos de Registro
            .addCase(register.pending, (state) => { state.status = 'loading'; })
            .addCase(register.fulfilled, (state) => {
                state.status = 'succeeded';
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            });
    }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;