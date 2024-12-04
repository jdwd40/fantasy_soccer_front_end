import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Trophy, Swords, Shield, User, Star } from 'lucide-react';
import { fetchTeamWithPlayers } from '../services/teamService';

interface TeamDetailsModalProps {
  teamId: number;
  onClose: () => void;
}

export const TeamDetailsModal: React.FC<TeamDetailsModalProps> = ({ teamId, onClose }) => {
  const { data: team, isLoading } = useQuery({
    queryKey: ['team', teamId],
    queryFn: () => fetchTeamWithPlayers(teamId),
    refetchInterval: 5000 // Refetch every 5 seconds to get updated stats
  });

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <p>Loading team details...</p>
        </div>
      </div>
    );
  }

  if (!team) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="border-b px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold">{team.name}</h2>
            {team.jcups_won > 0 && (
              <div className="flex items-center text-yellow-600">
                <Trophy className="w-5 h-5 mr-1" />
                <span>{team.jcups_won} {team.jcups_won === 1 ? 'title' : 'titles'}</span>
              </div>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-b">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
              <Swords className="w-6 h-6 text-blue-600 mb-1" />
              <span className="text-sm text-gray-600">Attack Rating</span>
              <span className="text-xl font-bold">{team.attackRating}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
              <Shield className="w-6 h-6 text-red-600 mb-1" />
              <span className="text-sm text-gray-600">Defense Rating</span>
              <span className="text-xl font-bold">{team.defenseRating}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
              <User className="w-6 h-6 text-yellow-600 mb-1" />
              <span className="text-sm text-gray-600">Goalkeeper Rating</span>
              <span className="text-xl font-bold">{team.goalkeeperRating}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
              <Trophy className="w-6 h-6 text-purple-600 mb-1" />
              <span className="text-sm text-gray-600">Season Record</span>
              <span className="text-xl font-bold">
                {team.wins}-{team.losses}
              </span>
            </div>
            <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
              <Star className="w-6 h-6 text-yellow-500 mb-1" />
              <span className="text-sm text-gray-600">Career Stats</span>
              <span className="text-xl font-bold">
                {team.jcups_won} 🏆 | {team.runner_ups} 🥈
              </span>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <h3 className="text-lg font-semibold mb-4">Squad</h3>
          <div className="space-y-3">
            {team.players
              .sort((a, b) => (a.isGoalkeeper === b.isGoalkeeper ? 0 : a.isGoalkeeper ? 1 : -1))
              .map((player, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    player.isGoalkeeper ? 'bg-yellow-50 border-yellow-200' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="font-semibold">{player.name}</span>
                      {player.isGoalkeeper && (
                        <span className="ml-2 text-sm text-yellow-600">Goalkeeper</span>
                      )}
                      {!player.isGoalkeeper && index < 2 && (
                        <span className="ml-2 text-sm text-blue-600">Forward</span>
                      )}
                      {!player.isGoalkeeper && index >= 2 && (
                        <span className="ml-2 text-sm text-red-600">Defender</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-sm">
                        <span className="text-blue-600">ATK: {player.attack}</span>
                        <span className="mx-2">|</span>
                        <span className="text-red-600">DEF: {player.defense}</span>
                      </div>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};