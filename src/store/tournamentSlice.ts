import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Tournament, Fixture, MatchResult } from '../types/tournament';
import { simulateMatch } from '../utils/matchSimulation';
import { generateNextRound } from '../utils/matchSimulation';

interface TournamentState {
  tournament: Tournament | null;
  loading: boolean;
  error: string | null;
}

interface UpdateMatchResultPayload {
  matchIndex: number;
  result: MatchResult;
}

const initialState: TournamentState = {
  tournament: null,
  loading: false,
  error: null,
};

const serializeTournament = (tournament: Tournament): Tournament => {
  return JSON.parse(JSON.stringify(tournament));
};

const tournamentSlice = createSlice({
  name: 'tournament',
  initialState,
  reducers: {
    setTournament: (state, action: PayloadAction<Tournament>) => {
      state.tournament = serializeTournament(action.payload);
      state.loading = false;
      state.error = null;
    },
    updateMatchResult: (state, action: PayloadAction<UpdateMatchResultPayload>) => {
      if (state.tournament?.fixtures && state.tournament.currentRound !== undefined) {
        const currentRound = state.tournament.currentRound;
        if (state.tournament.fixtures[currentRound]) {
          state.tournament.fixtures[currentRound][action.payload.matchIndex].result = 
            serializeTournament(action.payload.result);
        }
      }
    },
    simulateCurrentRound: (state) => {
      if (state.tournament?.fixtures && state.tournament.currentRound !== undefined) {
        const currentRound = state.tournament.currentRound;
        const currentFixtures = state.tournament.fixtures[currentRound];
        
        if (currentFixtures) {
          const updatedFixtures = currentFixtures.map(fixture => 
            fixture.result ? fixture : {
              ...fixture,
              result: serializeTournament(simulateMatch(fixture.team1, fixture.team2))
            }
          );
          
          state.tournament.fixtures[currentRound] = updatedFixtures;
          state.tournament.isSimulated = true;
        }
      }
    },
    progressToNextRound: (state) => {
      if (state.tournament?.fixtures && state.tournament.currentRound !== undefined && state.tournament.isSimulated) {
        const currentRound = state.tournament.currentRound;
        const currentFixtures = state.tournament.fixtures[currentRound];
        
        if (currentFixtures) {
          const nextRoundFixtures = serializeTournament(generateNextRound(currentFixtures));
          state.tournament.fixtures.push(nextRoundFixtures);
          state.tournament.currentRound = currentRound + 1;
          state.tournament.isSimulated = false;
          
          const roundNames = ['Round of 16', 'Quarter Finals', 'Semi Finals', 'Final'];
          state.tournament.message = `Tournament ${roundNames[currentRound + 1]} - Knockout Stage`;
        }
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setTournament,
  updateMatchResult,
  simulateCurrentRound,
  progressToNextRound,
  setLoading,
  setError,
} = tournamentSlice.actions;

export default tournamentSlice.reducer;