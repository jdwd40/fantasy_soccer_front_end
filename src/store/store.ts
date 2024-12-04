import { configureStore } from '@reduxjs/toolkit';
import tournamentReducer from './tournamentSlice';
import tournamentHistoryReducer from './tournamentHistory';

export const store = configureStore({
  reducer: {
    tournament: tournamentReducer,
    tournamentHistory: tournamentHistoryReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;