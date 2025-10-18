import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// URL base da sua API mockada
const GAMES_URL = 'http://localhost:3001/games';

// --- AÇÕES ASSÍNCRONAS ---

export const fetchGames = createAsyncThunk('games/fetchGames', async () => {
  const response = await axios.get(GAMES_URL);
  return response.data;
});

export const fetchGameById = createAsyncThunk('games/fetchGameById', async (gameId) => {
    const response = await axios.get(`${GAMES_URL}/${gameId}?_embed=reviews`);
    return response.data;
});

// --- NOVA AÇÃO PARA ADICIONAR UM JOGO ---
export const addNewGame = createAsyncThunk('games/addNewGame', async (newGameData) => {
    // Faz a requisição POST para o json-server com os dados do novo jogo
    const response = await axios.post(GAMES_URL, newGameData);
    // Retorna os dados do jogo que foi criado (incluindo o novo ID gerado pelo servidor)
    return response.data;
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
  name: 'games',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Casos para fetchGames
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
      // Casos para fetchGameById
      .addCase(fetchGameById.pending, (state) => {
        state.selectedGameStatus = 'loading';
      })
      .addCase(fetchGameById.fulfilled, (state, action) => {
        state.selectedGameStatus = 'succeeded';
        state.selectedGame = action.payload;
      })
      .addCase(fetchGameById.rejected, (state, action) => {
        state.selectedGameStatus = 'failed';
        state.error = action.error.message;
      })
      // --- NOVO CASO PARA addNewGame ---
      .addCase(addNewGame.fulfilled, (state, action) => {
        // Adiciona o novo jogo (que veio da API) ao final da lista de jogos no estado do Redux
        state.items.push(action.payload);
      });
  },
});

export default gamesSlice.reducer;