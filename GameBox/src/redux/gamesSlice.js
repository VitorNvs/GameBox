// src/redux/gamesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// URL base do seu NOVO servidor
const GAMES_URL = 'http://localhost:8000/jogos'; // Porta 8000

// --- AÇÕES ASSÍNCRONAS ---

export const fetchGames = createAsyncThunk('jogos/fetchGames', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(GAMES_URL);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const fetchGameById = createAsyncThunk('jogos/fetchGameById', async (gameId, { rejectWithValue }) => {
    try {
        const response = await axios.get(`${GAMES_URL}/${gameId}?_embed=reviews`);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

export const addNewGame = createAsyncThunk('jogos/addNewGame', async (newGameData, { rejectWithValue }) => {
    try {
        const response = await axios.post(GAMES_URL, newGameData);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

// --- NOVA AÇÃO DE ATUALIZAR ---
export const updateGame = createAsyncThunk('jogos/updateGame', async ({ id, ...gameData }, { rejectWithValue }) => {
    try {
        const response = await axios.patch(`${GAMES_URL}/${id}`, gameData);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});

// --- NOVA AÇÃO DE DELETAR ---
export const deleteGame = createAsyncThunk('jogos/deleteGame', async (gameId, { rejectWithValue }) => {
    try {
        await axios.delete(`${GAMES_URL}/${gameId}`);
        return gameId; // Retorna o ID do jogo deletado
    } catch (err) {
        return rejectWithValue(err.message);
    }
});


// --- ESTADO INICIAL ---
const initialState = {
    items: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    selectedGame: null,
    selectedGameStatus: 'idle',
};


// --- SLICE ---
const gamesSlice = createSlice({
    name: 'jogos',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Casos para fetchGames
            .addCase(fetchGames.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchGames.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchGames.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            
            // Casos para fetchGameById
            .addCase(fetchGameById.pending, (state) => { state.selectedGameStatus = 'loading'; })
            .addCase(fetchGameById.fulfilled, (state, action) => {
                state.selectedGameStatus = 'succeeded';
                state.selectedGame = action.payload;
            })
            .addCase(fetchGameById.rejected, (state, action) => {
                state.selectedGameStatus = 'failed';
                state.error = action.payload;
            })
            
            // Casos para addNewGame
            .addCase(addNewGame.pending, (state) => { state.status = 'loading'; })
            .addCase(addNewGame.fulfilled, (state, action) => {
                state.items.push(action.payload); // Adiciona o jogo
                state.status = 'idle'; // Volta para 'idle' para forçar o refetch
            })
            .addCase(addNewGame.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // --- NOVOS CASOS PARA updateGame ---
            .addCase(updateGame.pending, (state) => { state.status = 'loading'; })
            .addCase(updateGame.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.items.findIndex(game => game.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload; // Atualiza o jogo na lista
                }
                if (state.selectedGame && state.selectedGame.id === action.payload.id) {
                    state.selectedGame = action.payload; // Atualiza o jogo selecionado também
                }
            })
            .addCase(updateGame.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // --- NOVOS CASOS PARA deleteGame ---
            .addCase(deleteGame.pending, (state) => { state.status = 'loading'; })
            .addCase(deleteGame.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Remove o jogo do array 'items'
                state.items = state.items.filter(game => game.id !== action.payload); 
                if (state.selectedGame && state.selectedGame.id === action.payload) {
                    state.selectedGame = null; // Limpa o jogo selecionado se ele foi deletado
                }
            })
            .addCase(deleteGame.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default gamesSlice.reducer;