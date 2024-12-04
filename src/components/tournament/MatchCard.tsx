import React, { useState } from 'react';
import type { Fixture } from '../../types/tournament';
import { MatchSimulationModal } from './match/MatchSimulationModal';
import { useTournament } from '../../context/TournamentContext';
import { TeamInfo } from './TeamInfo';

interface MatchCardProps {
  fixture: Fixture;
  matchIndex: number;
}

export const MatchCard: React.FC<MatchCardProps> = ({ fixture, matchIndex }) => {
  const [showSimulation, setShowSimulation] = useState(false);
  const { updateMatchResult } = useTournament();
  const { result } = fixture;

  const handleMatchComplete = (matchResult: any) => {
    updateMatchResult(matchIndex, matchResult);
    setShowSimulation(false);
  };

  return (
    <>
      <div 
        className={`bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow border border-gray-200 
                   ${!result ? 'cursor-pointer' : 'cursor-default'}`}
        onClick={() => !result && setShowSimulation(true)}
      >
        <div className="space-y-4">
          <TeamInfo 
            team={fixture.team1} 
            score={result?.team1Score}
            extraTimeScore={result?.extraTime?.team1Score}
            penaltyScore={result?.penalties?.team1Score}
            isWinner={result?.winner.team_id === fixture.team1.team_id}
          />
          <div className="h-px bg-gray-200" />
          <TeamInfo 
            team={fixture.team2}
            score={result?.team2Score}
            extraTimeScore={result?.extraTime?.team2Score}
            penaltyScore={result?.penalties?.team2Score}
            isWinner={result?.winner.team_id === fixture.team2.team_id}
          />
        </div>
      </div>

      {showSimulation && (
        <MatchSimulationModal
          team1={fixture.team1}
          team2={fixture.team2}
          onClose={() => setShowSimulation(false)}
          onMatchComplete={handleMatchComplete}
        />
      )}
    </>
  );
};