import React, { createContext, useContext, useState } from 'react';
import type { Tournament, MatchResult } from '../types/tournament';
import { simulateMatch, generateNextRound } from '../utils/matchSimulation';
import { updateTournamentRecord } from '../services/teamService';

interface TournamentContextType {
  tournament: Tournament | null;
  setTournament: (tournament: Tournament) => void;
  updateMatchResult: (matchIndex: number, result: MatchResult) => void;
  simulateCurrentRound: () => void;
  progressToNextRound: () => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const TournamentContext = createContext<TournamentContextType | null>(null);

export const TournamentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMatchResult = async (matchIndex: number, result: MatchResult) => {
    if (!tournament?.fixtures || tournament.currentRound === undefined) return;

    // If this is the final match, update tournament records
    const isFinalMatch = tournament.currentRound === 3;
    if (isFinalMatch) {
      try {
        console.log('Updating tournament records for final match');
        
        // Update winner's record
        await updateTournamentRecord(result.winner.team_id, true);
        
        // Update runner-up's record
        const fixture = tournament.fixtures[tournament.currentRound][matchIndex];
        const runnerUpId = result.winner.team_id === fixture.team1.team_id 
          ? fixture.team2.team_id 
          : fixture.team1.team_id;
        await updateTournamentRecord(runnerUpId, false);
        
        console.log('Tournament records updated successfully');
      } catch (error) {
        console.error('Error updating tournament records:', error);
        setError('Failed to update tournament records');
      }
    }

    setTournament(prevTournament => {
      if (!prevTournament) return null;
      return {
        ...prevTournament,
        fixtures: prevTournament.fixtures.map((round, roundIndex) => {
          if (roundIndex === tournament.currentRound) {
            return round.map((fixture, index) => {
              if (index === matchIndex) {
                return { ...fixture, result };
              }
              return fixture;
            });
          }
          return round;
        }),
      };
    });
  };

  const simulateCurrentRound = async () => {
    if (!tournament?.fixtures || tournament.currentRound === undefined) return;

    const currentRound = tournament.currentRound;
    const currentFixtures = tournament.fixtures[currentRound];

    const updatedFixtures = currentFixtures.map(fixture => 
      fixture.result ? fixture : { ...fixture, result: simulateMatch(fixture.team1, fixture.team2) }
    );

    setTournament(prevTournament => {
      if (!prevTournament) return null;
      return {
        ...prevTournament,
        fixtures: prevTournament.fixtures.map((round, index) => 
          index === currentRound ? updatedFixtures : round
        ),
        isSimulated: true,
      };
    });

    // Check if it's the final round
    if (currentRound === tournament.fixtures.length - 1) {
      const finalMatch = updatedFixtures[0];
      const winner = finalMatch.result?.winner;
      const runnerUp = finalMatch.result?.winner.team_id === finalMatch.team1.team_id 
        ? finalMatch.team2 
        : finalMatch.team1;

      if (winner && runnerUp) {
        try {
          await updateTournamentRecord(winner.team_id, true);
          await updateTournamentRecord(runnerUp.team_id, false);
          console.log('Tournament records updated successfully');
        } catch (error) {
          console.error('Error updating tournament records:', error);
        }
      }
    }
  };

  const progressToNextRound = () => {
    if (!tournament?.fixtures || tournament.currentRound === undefined || !tournament.isSimulated) return;

    const currentRound = tournament.currentRound;
    const nextRoundFixtures = generateNextRound(tournament.fixtures[currentRound]);
    const roundNames = ['Round of 16', 'Quarter Finals', 'Semi Finals', 'Final'];

    setTournament(prevTournament => {
      if (!prevTournament) return null;
      return {
        ...prevTournament,
        fixtures: [...prevTournament.fixtures, nextRoundFixtures],
        currentRound: currentRound + 1,
        isSimulated: false,
        message: `Tournament ${roundNames[currentRound + 1]} - Knockout Stage`,
      };
    });
  };

  const value = {
    tournament,
    setTournament,
    updateMatchResult,
    simulateCurrentRound,
    progressToNextRound,
    loading,
    setLoading,
    error,
    setError,
  };

  return (
    <TournamentContext.Provider value={value}>
      {children}
    </TournamentContext.Provider>
  );
};

export const useTournament = () => {
  const context = useContext(TournamentContext);
  if (!context) {
    throw new Error('useTournament must be used within a TournamentProvider');
  }
  return context;
};