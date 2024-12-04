import React from 'react';
import type { Team } from '../../../types/tournament';
import { Trophy } from 'lucide-react';

interface MatchScoreProps {
  team1: Team;
  team2: Team;
  score: {
    team1: number;
    team2: number;
  };
}

export const MatchScore: React.FC<MatchScoreProps> = ({ team1, team2, score }) => {
  return (
    <div className="flex items-center justify-between mb-6">
      {/* Team 1 */}
      <div className="text-center flex-1">
        <div className="flex items-center justify-center mb-2">
          <Trophy className={`w-5 h-5 mr-2 ${team1.jcups_won > 0 ? 'text-yellow-500' : 'text-gray-300'}`} />
          <h3 className="text-xl font-bold">{team1.name}</h3>
        </div>
        <div className="text-4xl font-bold">{score.team1}</div>
      </div>

      {/* VS */}
      <div className="px-4 text-gray-400 text-xl font-bold">VS</div>

      {/* Team 2 */}
      <div className="text-center flex-1">
        <div className="flex items-center justify-center mb-2">
          <Trophy className={`w-5 h-5 mr-2 ${team2.jcups_won > 0 ? 'text-yellow-500' : 'text-gray-300'}`} />
          <h3 className="text-xl font-bold">{team2.name}</h3>
        </div>
        <div className="text-4xl font-bold">{score.team2}</div>
      </div>
    </div>
  );
};