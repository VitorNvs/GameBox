// src/redux/achievementsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// O URL está CORRETO (porta 8000, sem /api)
const API_URL = 'http://localhost:8000/achievements'; 

// THUNK: Buscar Conquistas
export const fetchAchievements = createAsyncThunk(
    'achievements/fetchAchievements',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (err) { return rejectWithValue(err.message); }
    }
);

// THUNK: Adicionar Nova Conquista
export const addNewAchievement = createAsyncThunk(
    'achievements/addNewAchievement',
    async (newAchievementData, { rejectWithValue }) => {
        try {
            const response = await axios.post(API_URL, newAchievementData);
            return response.data;
        } catch (err) { return rejectWithValue(err.message); }
    }
);

// THUNK: ATUALIZAR CONQUISTA (CORRIGIDO)
export const updateAchievement = createAsyncThunk(
    'achievements/updateAchievement',
    async (achievementData, { rejectWithValue }) => {
        try {
            // --- CORREÇÃO 4: Desestruturar '_id' em vez de 'id' ---
            const { _id, ...data } = achievementData; 
            const response = await axios.patch(`${API_URL}/${_id}`, data);
            return response.data;
        } catch (err) { return rejectWithValue(err.message); }
    }
);

// THUNK: Apagar Conquista
export const deleteAchievement = createAsyncThunk(
    'achievements/deleteAchievement',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return id;
        } catch (err) { return rejectWithValue(err.message); }
    }
);

const initialState = {
  items: [],
  status: 'idle',
  error: null,
};

const achievementsSlice = createSlice({
    name: 'achievements',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchAchievements.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchAchievements.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchAchievements.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Add New
            .addCase(addNewAchievement.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            // ATUALIZAR (CORRIGIDO)
            .addCase(updateAchievement.fulfilled, (state, action) => {
                // --- CORREÇÃO 5: Usar '_id' para encontrar o índice ---
                const index = state.items.findIndex(item => item._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
           // Delete (CORRIGIDO)
            .addCase(deleteAchievement.fulfilled, (state, action) => {
                // --- CORREÇÃO 6: Usar '_id' para filtrar ---
                state.items = state.items.filter(item => item._id !== action.payload);
      });
    },
});

export default achievementsSlice.reducer;