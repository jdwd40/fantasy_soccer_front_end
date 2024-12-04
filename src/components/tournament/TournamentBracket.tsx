import React from 'react';
import type { Fixture } from '../../types/tournament';
import { MatchCard } from './MatchCard';

interface TournamentBracketProps {
  fixtures: Fixture[][];
  currentRound: number;
}

export const TournamentBracket: React.FC<TournamentBracketProps> = ({ fixtures, currentRound }) => {
  if (!fixtures || !fixtures[currentRound]) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-6">
        <div className="text-center text-gray-600">
          Loading tournament bracket...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {fixtures[currentRound].map((fixture, index) => (
          <MatchCard 
            key={`${fixture.team1.team_id}-${fixture.team2.team_id}-${index}`} 
            fixture={fixture}
            matchIndex={index}
          />
        ))}
      </div>
    </div>
  );
};