import { configureStore } from '@reduxjs/toolkit';
import gamesReducer from './gamesSlice';
import reviewsReducer from './reviewsSlice';
import listsReducer from './listsSlice';
import achievementsReducer from './AchievementsSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    jogos: gamesReducer,
    reviews: reviewsReducer,
    lists: listsReducer,
    achievements: achievementsReducer,
    auth: authReducer,
  },
});