import React from 'react';
import { Play, ArrowRight } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';

export const TournamentControls: React.FC = () => {
  const { tournament, simulateCurrentRound, progressToNextRound } = useTournament();
  
  if (!tournament) return null;

  const handleSimulateRound = () => {
    simulateCurrentRound();
  };

  const handleNextRound = () => {
    progressToNextRound();
  };

  const isLastRound = tournament.currentRound === 3;
  const hasWinner = isLastRound && tournament.isSimulated;

  return (
    <div className="flex justify-center space-x-4 my-6">
      {!tournament.isSimulated && !hasWinner && (
        <button
          onClick={handleSimulateRound}
          className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg
                   hover:bg-blue-700 transition-colors duration-200"
        >
          <Play className="w-5 h-5 mr-2" />
          Simulate Round
        </button>
      )}
      {tournament.isSimulated && !hasWinner && (
        <button
          onClick={handleNextRound}
          className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg
                   hover:bg-green-700 transition-colors duration-200"
        >
          <ArrowRight className="w-5 h-5 mr-2" />
          Next Round
        </button>
      )}
    </div>
  );
};