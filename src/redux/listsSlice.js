// src/redux/listsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/lists'; // Verifique se a porta está correta

// THUNK: Buscar listas
export const fetchLists = createAsyncThunk(
    'lists/fetchLists',
    async (_, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token; // Pega o token
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` // Cria o cabeçalho
                }
            };
            const response = await axios.get(API_URL, config); // Envia o config
            // ...
            const data = Array.isArray(response.data)
                ? response.data.map(item => ({ ...item, id: item.id || item._id }))
                : { ...response.data, id: response.data.id || response.data._id };
            return data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// THUNK: Criar lista
export const createList = createAsyncThunk(
    'lists/createList',
    async (newListData, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token; // Pega o token
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` // Cria o cabeçalho
                }
            };
            const listToCreate = { 
                ...newListData, 
                gamesCount: 0, 
                games: [] 
            };
            const response = await axios.post(API_URL, listToCreate, config); // Envia o config
            // ...
            const created = { ...response.data, id: response.data.id || response.data._id };
            return created;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// THUNK: Deletar lista (IMPLEMENTAÇÃO)
export const deleteList = createAsyncThunk(
    'lists/deleteList',
    async (listId, { rejectWithValue, getState }) => {
        try {
            // Assume que você tem um token JWT armazenado em algum lugar do Redux (ex: state.auth.token)
            const token = getState().auth.token; 
            
            await axios.delete(`${API_URL}/${listId}`, {
                headers: {
                    Authorization: `Bearer ${token}` // Envia o token para autenticação
                }
            });
            return listId; // Retorna o ID para o reducer remover do estado
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// THUNK: Atualizar detalhes da lista (título, descrição) (IMPLEMENTAÇÃO)
export const updateListDetails = createAsyncThunk(
    'lists/updateListDetails',
    async ({ id, title, description }, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token; // Pega o token
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` // Cria o cabeçalho
                }
            };
            const response = await axios.patch(`${API_URL}/${id}`, { title, description }, config); // Envia o config
            const updated = { ...response.data, id: response.data.id || response.data._id };
            return updated;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);
// NOVO THUNK: Atualizar os jogos (adicionar/remover)
export const updateListGames = createAsyncThunk(
    'lists/updateListGames',
    async ({ listId, updatedGames }, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token; // Pega o token
            const config = {
                headers: {
                    Authorization: `Bearer ${token}` // Cria o cabeçalho
                }
            };
            const response = await axios.patch(`${API_URL}/${listId}`, { 
                games: updatedGames,
                gamesCount: updatedGames.length
            }, config); // Envia o config
            const updated = { ...response.data, id: response.data.id || response.data._id };
            return updated;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
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