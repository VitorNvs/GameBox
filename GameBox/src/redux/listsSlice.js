// src/redux/listsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/lists'; // Verifique se a porta está correta

// THUNK: Buscar listas
export const fetchLists = createAsyncThunk(
    'lists/fetchLists',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(API_URL);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// THUNK: Criar lista
export const createList = createAsyncThunk(
    'lists/createList',
    async (newListData, { rejectWithValue }) => {
        try {
            // CORREÇÃO: Novas listas agora são criadas com um array 'games' vazio
            const listToCreate = { 
                ...newListData, 
                gamesCount: 0, 
                games: [] // <-- MUITO IMPORTANTE
            };
            const response = await axios.post(API_URL, listToCreate);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// THUNK: Deletar lista
export const deleteList = createAsyncThunk(
    'lists/deleteList',
    async (listId, { rejectWithValue }) => {
        try {
            await axios.delete(`${API_URL}/${listId}`);
            return listId;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// NOVO THUNK: Salvar (atualizar) os detalhes da lista (título, descrição)
export const updateListDetails = createAsyncThunk(
    'lists/updateListDetails',
    async ({ id, title, description }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${API_URL}/${id}`, { title, description });
            return response.data; // Retorna a lista atualizada
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// NOVO THUNK: Atualizar os jogos (adicionar/remover)
export const updateListGames = createAsyncThunk(
    'lists/updateListGames',
    async ({ listId, updatedGames }, { rejectWithValue }) => {
        try {
            // Atualiza o array 'games' e o 'gamesCount'
            const response = await axios.patch(`${API_URL}/${listId}`, { 
                games: updatedGames,
                gamesCount: updatedGames.length
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

const listsSlice = createSlice({
    name: 'lists',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchLists.pending, (state) => { state.status = 'loading'; })
            .addCase(fetchLists.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchLists.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })
            // Create
            .addCase(createList.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            // Delete
            .addCase(deleteList.fulfilled, (state, action) => {
                state.items = state.items.filter(list => list.id !== action.payload);
            })
            // NOVO: Update (Salvar)
            .addCase(updateListDetails.fulfilled, (state, action) => {
                const index = state.items.findIndex(list => list.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload; // Atualiza a lista no store
                }
            })
            // NOVO: Update Games
            .addCase(updateListGames.fulfilled, (state, action) => {
                const index = state.items.findIndex(list => list.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload; // Atualiza a lista no store
                }
            });
    },
});

export default listsSlice.reducer;