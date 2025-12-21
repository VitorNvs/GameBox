// src/redux/reviewsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// O BACKEND REAL (Node + MongoDB)
const API_URL = 'http://localhost:8000/reviews';

const authConfig = (getState) => {
  const token = getState().auth?.token;
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};

// Criar review COM JWT
export const createReview = createAsyncThunk(
    'reviews/createReview',
    async (reviewData, { rejectWithValue }) => {
        try {
            const config = authConfig(getState);
            const token = localStorage.getItem('token');

            if (!token) {
                return rejectWithValue('Usuário não autenticado.');
            }

            const response = await axios.post(API_URL, reviewData, config);

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

// Buscar reviews do usuário logado
export const fetchMyReviews = createAsyncThunk(
    'reviews/fetchMyReviews',
    async (_, { rejectWithValue }) => {
        try {
            const config = authConfig(getState);
            const token = localStorage.getItem('token');

            const response = await axios.get(`${API_URL}/me`, config);

            return response.data;
        } catch (err) {
            return rejectWithValue(err.response?.data?.message || err.message);
        }
    }
);

const reviewsSlice = createSlice({
    name: 'reviews',
    initialState: {
        items: [],
        myReviews: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createReview.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(fetchMyReviews.fulfilled, (state, action) => {
                state.myReviews = action.payload;
            });
    },
});

export default reviewsSlice.reducer;
