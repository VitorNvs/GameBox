// src/redux/achievementsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/achievements'; // Porta 8000

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

// --- NOVO THUNK: ATUALIZAR CONQUISTA ---
export const updateAchievement = createAsyncThunk(
    'achievements/updateAchievement',
    async (achievementData, { rejectWithValue }) => {
        try {
            const { id, ...data } = achievementData;
            // Faz a requisição PATCH para o seu server.js
            const response = await axios.patch(`${API_URL}/${id}`, data);
            return response.data; // Retorna a conquista atualizada
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// THUNK: Deletar Conquista
export const deleteAchievement = createAsyncThunk(
    'achievements/deleteAchievement',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${id}`);
            return id;
        } catch (err) { return rejectWithValue(err.message); }
    }
);

const achievementsSlice = createSlice({
    name: 'achievements',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
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
            // --- NOVO REDUCER: ATUALIZAR ---
            .addCase(updateAchievement.fulfilled, (state, action) => {
                // Encontra a conquista na lista e a substitui pela versão atualizada
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            // Delete
            .addCase(deleteAchievement.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            });
    },
});

export default achievementsSlice.reducer;