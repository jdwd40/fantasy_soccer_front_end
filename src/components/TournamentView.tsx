import React from 'react';
import { useTournament } from '../context/TournamentContext';
import { TournamentHeader } from './tournament/TournamentHeader';
import { TournamentBracket } from './tournament/TournamentBracket';
import { TournamentControls } from './tournament/TournamentControls';
import { TournamentResults } from './tournament/TournamentResults';

export const TournamentView: React.FC = () => {
  const { tournament, loading } = useTournament();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center text-gray-600">
          Loading tournament...
        </div>
      </div>
    );
  }

  if (!tournament) return null;

  const isComplete = tournament.currentRound === 3 && tournament.isSimulated;

  if (isComplete) {
    return <TournamentResults fixtures={tournament.fixtures} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <TournamentHeader 
        message={tournament.message} 
        currentRound={tournament.currentRound || 0}
      />
      <TournamentControls />
      <TournamentBracket 
        fixtures={tournament.fixtures}
        currentRound={tournament.currentRound || 0}
      />
    </div>
  );
};