import React from 'react';
import type { Team } from '../../types/tournament';
import { Trophy, Swords } from 'lucide-react';

interface TeamInfoProps {
  team: Team;
  score?: number;
  extraTimeScore?: number;
  penaltyScore?: number;
  isWinner?: boolean;
}

export const TeamInfo: React.FC<TeamInfoProps> = ({ 
  team, 
  score, 
  extraTimeScore,
  penaltyScore,
  isWinner 
}) => {
  const displayScore = () => {
    if (typeof score !== 'number') return null;
    
    let result = `${score}`;
    if (typeof extraTimeScore === 'number') {
      result += ` (${score + extraTimeScore})`;
    }
    if (typeof penaltyScore === 'number') {
      result += ` [${penaltyScore}]`;
    }
    return result;
  };

  return (
    <div className={`flex items-center justify-between ${isWinner ? 'bg-green-50 -mx-4 px-4 py-2 rounded' : ''}`}>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
          <Trophy 
            className={`w-4 h-4 ${
              team.jcups_won > 0 ? 'text-yellow-500' : 'text-gray-400'
            }`} 
          />
        </div>
        <div>
          <span className="font-semibold">{team.name}</span>
          {team.jcups_won > 0 && (
            <span className="ml-2 text-xs text-yellow-600">
              ({team.jcups_won} {team.jcups_won === 1 ? 'title' : 'titles'})
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-600 flex items-center">
          <Swords className="w-4 h-4 mr-1" />
          <span className="mr-2">ATK: {team.attackRating}</span>
          <span className="mr-2">DEF: {team.defenseRating}</span>
          {displayScore() && (
            <span className="font-bold text-lg ml-2">{displayScore()}</span>
          )}
        </div>
      </div>
    </div>
  );
};