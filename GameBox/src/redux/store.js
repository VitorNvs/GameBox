import { configureStore } from '@reduxjs/toolkit';
import gamesReducer from './gamesSlice'; // Importe o reducer

export const store = configureStore({
  reducer: {
    games: gamesReducer, // Registre o reducer aqui
  },
});