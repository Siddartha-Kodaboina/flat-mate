
import { configureStore } from '@reduxjs/toolkit';
import vacancyReducer from './features/vacancySlice';

export const store = configureStore({
  reducer: {
    vacancy: vacancyReducer,
  },
});
