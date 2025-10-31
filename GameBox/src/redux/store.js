import { configureStore } from '@reduxjs/toolkit';
import gamesReducer from './gamesSlice';
import reviewsReducer from './reviewsSlice';
import listsReducer from './listsSlice';
import achievementsReducer from './AchievementsSlice';

export const store = configureStore({
  reducer: {
    games: gamesReducer,
    reviews: reviewsReducer,
    lists: listsReducer,
    achievements: achievementsReducer, // Registre o reducer aqui
  },
});