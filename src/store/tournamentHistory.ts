import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TournamentRecord } from '../types/tournament';

interface TournamentHistoryState {
  records: TournamentRecord[];
}

const initialState: TournamentHistoryState = {
  records: JSON.parse(localStorage.getItem('tournamentHistory') || '[]')
};

const tournamentHistorySlice = createSlice({
  name: 'tournamentHistory',
  initialState,
  reducers: {
    addRecord: (state, action: PayloadAction<TournamentRecord>) => {
      state.records.push(action.payload);
      localStorage.setItem('tournamentHistory', JSON.stringify(state.records));
    },
    clearHistory: (state) => {
      state.records = [];
      localStorage.removeItem('tournamentHistory');
    }
  }
});

export const { addRecord, clearHistory } = tournamentHistorySlice.actions;
export default tournamentHistorySlice.reducer;