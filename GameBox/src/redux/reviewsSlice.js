// src/redux/reviewsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Estou assumindo que seu servidor db.json roda em http://localhost:5000/reviews
// Se for outra porta (ex: 3001) ou endpoint, mude aqui.
const API_URL = 'http://localhost:8000/reviews'; 

// Esta é a Ação Assíncrona que o formulário chama
export const createReview = createAsyncThunk(
    'reviews/createReview',
    async (reviewData, { rejectWithValue }) => {
        try {
            // Adicionamos a data atual à review
            const newReview = {
                ...reviewData,
                createdAt: new Date().toISOString(),
            };
            // Fazemos a requisição POST para salvar no servidor
            const response = await axios.post(API_URL, newReview);
            return response.data; // Retorna a review salva
        } catch (err) {
            // Em caso de erro, rejeita a promise com a mensagem de erro
            return rejectWithValue(err.message);
        }
    }
);

const reviewsSlice = createSlice({
    name: 'reviews',
    initialState: {
        items: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Quando a ação 'createReview' está pendente (carregando)
            .addCase(createReview.pending, (state) => {
                state.status = 'loading';
            })
            // Quando a ação 'createReview' foi bem-sucedida
            .addCase(createReview.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // Adiciona a nova review à lista de 'items'
                state.items.push(action.payload);
            })
            // Quando a ação 'createReview' falhou
            .addCase(createReview.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default reviewsSlice.reducer;