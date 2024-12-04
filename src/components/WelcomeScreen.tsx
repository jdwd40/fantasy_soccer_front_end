import React from 'react';
import { Trophy } from 'lucide-react';
import { useTournament } from '../context/TournamentContext';
import { getInitialTournamentState } from '../utils/tournament';

export const WelcomeScreen: React.FC = () => {
  const { setTournament, setLoading, setError } = useTournament();

  const handleStartTournament = async () => {
    try {
      setLoading(true);
      const tournamentState = await getInitialTournamentState();
      setTournament(tournamentState);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to start tournament');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl p-8 text-center">
        <Trophy className="w-16 h-16 mx-auto text-blue-600 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Fantasy Soccer Tournament
        </h1>
        <p className="text-gray-600 mb-8">
          Welcome to the ultimate soccer experience! Start your journey to glory.
        </p>
        <button
          onClick={handleStartTournament}
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold
                   hover:bg-blue-700 transition-colors duration-200"
        >
          Start Tournament
        </button>
      </div>
    </div>
  );
};