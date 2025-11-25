// src/redux/CategoriesSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:8000/categories' // A URL do seu backend

// Thunks assíncronos para o CRUD
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
    const response = await axios.get(API_URL);
    return response.data;
});

export const addNewCategory = createAsyncThunk('categories/addNewCategory', async (newCategoryData) => {
    const response = await axios.post(API_URL, newCategoryData);
    return response.data;
});
/*
export const updateCategory = createAsyncThunk('categories/updateCategory', async (updatedCategoryData) => {
    const { _id, ...data } = updatedCategoryData;
    const response = await axios.put(`${API_URL}/${_id}`, data);
    return response.data;
});
*/
export const updateCategory = createAsyncThunk('categories/updateCategory', async ({_id, ...categoryData }, { rejectWithValue }) => {
    try {
        const response = await axios.patch(`${API_URL}/${_id}`, categoryData);
        return response.data;
    } catch (err) {
        return rejectWithValue(err.message);
    }
});


export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (categoryId) => {
    await axios.delete(`${API_URL}/${categoryId}`);
    return categoryId; // Retorna o ID para remover do estado
});

// Slice
const categoriesSlice = createSlice({
    name: 'categories',
    initialState: {
        items: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch
            .addCase(fetchCategories.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            // Create
            .addCase(addNewCategory.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            // Update
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.items.findIndex(cat => cat._id === action.payload._id);
                if (index !== -1) {
                    state.items[index] = action.payload; // Substitui o item antigo pelo atualizado
                }
            })
            // Delete
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.items = state.items.filter(cat => cat._id !== action.payload);
            });
    },
});

export default categoriesSlice.reducer;