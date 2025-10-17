import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// 1. Ação assíncrona para buscar os dados
export const fetchGames = createAsyncThunk('games/fetchGames', async () => {
  const response = await axios.get('http://localhost:3001/games');
  return response.data;
});
export const fetchGameById = createAsyncThunk('games/fetchGameById', async (gameId) => {
    // A query `_embed=reviews` faz o json-server incluir as avaliações no resultado do jogo
    const response = await axios.get(`http://localhost:3001/games/${gameId}?_embed=reviews`);
    return response.data;
});

const initialState = {
  items: [],      // Array para guardar os jogos
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  selectedGame: null, // Para guardar os detalhes do jogo selecionado
  selectedGameStatus: 'idle',
};

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchGameById.pending, (state) => {
        state.selectedGameStatus = 'loading';
      })
      .addCase(fetchGameById.fulfilled, (state, action) => {
        state.selectedGameStatus = 'succeeded';
        state.selectedGame = action.payload; // Guarda o jogo retornado no estado
      })
      .addCase(fetchGameById.rejected, (state, action) => {
        state.selectedGameStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export default gamesSlice.reducer;