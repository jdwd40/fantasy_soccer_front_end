import React from 'react';
import { Trophy, Medal, Crown, Sparkles, ArrowRight } from 'lucide-react';
import { useTournament } from '../../context/TournamentContext';
import { getInitialTournamentState } from '../../utils/tournament';
import type { Fixture } from '../../types/tournament';

interface TournamentResultsProps {
  fixtures: Fixture[][];
}

export const TournamentResults: React.FC<TournamentResultsProps> = ({ fixtures }) => {
  const { setTournament } = useTournament();
  const finalMatch = fixtures[fixtures.length - 1][0];
  const winner = finalMatch.result?.winner;
  const runnerUp = finalMatch.result?.winner.team_id === finalMatch.team1.team_id 
    ? finalMatch.team2 
    : finalMatch.team1;

  const handleNewTournament = async () => {
    const tournamentState = await getInitialTournamentState();
    setTournament(tournamentState);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Champion Section */}
        <div className="bg-yellow-50 p-8 text-center border-b-4 border-yellow-200">
          <div className="inline-block p-4 bg-yellow-100 rounded-full mb-4">
            <Trophy className="w-16 h-16 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Tournament Champion</h1>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h2 className="text-3xl font-bold text-blue-900">{winner?.name}</h2>
          </div>
          <div className="flex justify-center items-center space-x-2 text-gray-600">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>{winner?.jcups_won + 1} Career Titles</span>
          </div>
        </div>

        {/* Runner-up Section */}
        <div className="p-8 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Medal className="w-8 h-8 text-gray-400" />
            <h3 className="text-2xl font-semibold text-gray-700">Runner-up: {runnerUp?.name}</h3>
          </div>
        </div>

        {/* Final Score Section */}
        <div className="p-8 bg-white">
          <h3 className="text-xl font-semibold text-gray-700 mb-4 text-center">Final Match Result</h3>
          <div className="flex justify-center items-center space-x-8">
            <div className="text-center">
              <p className="font-semibold">{finalMatch.team1.name}</p>
              <p className="text-2xl font-bold">{finalMatch.result?.team1Score}</p>
            </div>
            <div className="text-gray-400">vs</div>
            <div className="text-center">
              <p className="font-semibold">{finalMatch.team2.name}</p>
              <p className="text-2xl font-bold">{finalMatch.result?.team2Score}</p>
            </div>
          </div>
          {finalMatch.result?.extraTime && (
            <p className="text-center text-gray-500 mt-2">
              After Extra Time: {finalMatch.result.extraTime.team1Score} - {finalMatch.result.extraTime.team2Score}
            </p>
          )}
          {finalMatch.result?.penalties && (
            <p className="text-center text-gray-500 mt-2">
              Penalties: {finalMatch.result.penalties.team1Score} - {finalMatch.result.penalties.team2Score}
            </p>
          )}
        </div>

        {/* New Tournament Button */}
        <div className="p-8 bg-gray-50 text-center">
          <button
            onClick={handleNewTournament}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg
                     text-lg font-semibold hover:bg-blue-700 transition-colors duration-200
                     shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform"
          >
            <Sparkles className="w-6 h-6 mr-2" />
            Start New Tournament
            <ArrowRight className="w-6 h-6 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};