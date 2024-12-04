import React from 'react';
import type { Fixture } from '../types/tournament';
import { Trophy, Swords } from 'lucide-react';

interface MatchCardProps {
  fixture: Fixture;
}

export const MatchCard: React.FC<MatchCardProps> = ({ fixture }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-200">
      <div className="space-y-4">
        {[fixture.team1, fixture.team2].map((team, index) => (
          <div key={team.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Trophy className={`w-4 h-4 ${team.jcups_won > 0 ? 'text-yellow-500' : 'text-gray-400'}`} />
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
                <span>DEF: {team.defenseRating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};