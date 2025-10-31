import { configureStore } from '@reduxjs/toolkit';
import gamesReducer from './gamesSlice';
import reviewsReducer from './reviewsSlice';
import listsReducer from './listsSlice';

export const store = configureStore({
  reducer: {
    games: gamesReducer,
    reviews: reviewsReducer,
    lists: listsReducer, // Registre o reducer aqui
  },
});