import React from 'react';
import { Trophy } from 'lucide-react';

interface TournamentHeaderProps {
  message: string;
  currentRound: number;
}

export const TournamentHeader: React.FC<TournamentHeaderProps> = ({ message, currentRound }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center mb-4">
          <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">
            Fantasy Soccer Tournament
          </h1>
        </div>
        <div className="text-gray-600">
          <p className="text-lg">{message}</p>
          <p className="text-sm mt-2">Round {currentRound + 1}</p>
        </div>
      </div>
    </header>
  );
};