import React, { useState, useEffect } from 'react';
import { Target, Circle, XCircle } from 'lucide-react';
import type { Team } from '../../../types/tournament';

interface PenaltyShootoutProps {
  team1: Team;
  team2: Team;
  onComplete: (result: { team1Score: number; team2Score: number; penalties: PenaltyRound[] }) => void;
}

interface PenaltyRound {
  round: number;
  team1: { taker: string; scored: boolean };
  team2: { taker: string; scored: boolean };
  isSuddenDeath: boolean;
}

const generatePlayerName = () => {
  const firstNames = ['John', 'James', 'David', 'Michael', 'Robert', 'Carlos', 'Juan', 'Luis'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Rodriguez'];
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

export const PenaltyShootout: React.FC<PenaltyShootoutProps> = ({
  team1,
  team2,
  onComplete,
}) => {
  const [currentRound, setCurrentRound] = useState(1);
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [penaltyRounds, setPenaltyRounds] = useState<PenaltyRound[]>([]);
  const [currentKicker, setCurrentKicker] = useState<1 | 2>(1);
  const [isComplete, setIsComplete] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const simulatePenalty = (team: Team) => {
    const baseChance = 0.75;
    const skillBonus = (team.attackRating - 75) * 0.01;
    return Math.random() < (baseChance + skillBonus);
  };

  const checkWinner = (t1Score: number, t2Score: number, round: number) => {
    const remainingKicks = 5 - round + 1;
    if (round <= 5) {
      if (Math.abs(t1Score - t2Score) > remainingKicks) {
        return true;
      }
    } else {
      if (round % 2 === 0 && t1Score !== t2Score) {
        return true;
      }
    }
    return false;
  };

  useEffect(() => {
    if (isComplete || showReport) return;

    const timer = setTimeout(() => {
      const isSuddenDeath = currentRound > 5;
      
      if (currentKicker === 1) {
        const scored = simulatePenalty(team1);
        const newScore = team1Score + (scored ? 1 : 0);
        setTeam1Score(newScore);
        
        setPenaltyRounds(prev => [...prev, {
          round: currentRound,
          team1: { taker: generatePlayerName(), scored },
          team2: { taker: '', scored: false },
          isSuddenDeath
        }]);
        
        setCurrentKicker(2);
      } else {
        const scored = simulatePenalty(team2);
        const newScore = team2Score + (scored ? 1 : 0);
        setTeam2Score(newScore);
        
        setPenaltyRounds(prev => {
          const updated = [...prev];
          updated[updated.length - 1].team2 = { taker: generatePlayerName(), scored };
          return updated;
        });
        
        if (checkWinner(team1Score, newScore, currentRound)) {
          setIsComplete(true);
          setShowReport(true);
        } else {
          setCurrentRound(prev => prev + 1);
          setCurrentKicker(1);
        }
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentRound, currentKicker, team1Score, team2Score, isComplete, showReport]);

  if (showReport) {
    return (
      <div className="bg-white rounded-lg p-6">
        <h3 className="text-2xl font-bold mb-6 text-center">Penalty Shootout Result</h3>
        
        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <h4 className="font-semibold mb-2">{team1.name}</h4>
            <div className="text-4xl font-bold">{team1Score}</div>
          </div>
          <div className="text-4xl font-bold text-gray-400 px-4">-</div>
          <div className="text-center flex-1">
            <h4 className="font-semibold mb-2">{team2.name}</h4>
            <div className="text-4xl font-bold">{team2Score}</div>
          </div>
        </div>

        <div className="max-h-[400px] overflow-y-auto mb-8 pr-2">
          <div className="space-y-4">
            {penaltyRounds.map((round, index) => (
              <div key={index} className="border rounded-lg p-4 bg-white">
                <div className="text-sm text-gray-500 mb-2">
                  {round.isSuddenDeath ? 'Sudden Death' : `Round ${round.round}`}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    {round.team1.scored ? (
                      <Circle className="w-4 h-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-500 mr-2" />
                    )}
                    <span>{round.team1.taker}</span>
                  </div>
                  <div className="flex items-center">
                    {round.team2.taker && (
                      <>
                        {round.team2.scored ? (
                          <Circle className="w-4 h-4 text-green-500 mr-2" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500 mr-2" />
                        )}
                        <span>{round.team2.taker}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => onComplete({ team1Score, team2Score, penalties: penaltyRounds })}
          className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold
                   hover:bg-blue-700 transition-colors duration-200"
        >
          End Match
        </button>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold mb-6">Penalty Shootout</h3>
      
      <div className="flex justify-center items-center space-x-12 mb-8">
        <div className="text-center">
          <h4 className="font-semibold mb-2">{team1.name}</h4>
          <div className="text-4xl font-bold">{team1Score}</div>
        </div>
        <div className="text-4xl font-bold text-gray-400">-</div>
        <div className="text-center">
          <h4 className="font-semibold mb-2">{team2.name}</h4>
          <div className="text-4xl font-bold">{team2Score}</div>
        </div>
      </div>

      <div className="max-h-[300px] overflow-y-auto mb-6">
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {penaltyRounds.map((round, index) => (
            <React.Fragment key={index}>
              <div className={`flex items-center justify-center p-2 rounded ${
                round.team1.scored ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                <Target className="w-4 h-4 mr-2" />
                {round.team1.taker}
              </div>
              {round.team2.taker && (
                <div className={`flex items-center justify-center p-2 rounded ${
                  round.team2.scored ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  <Target className="w-4 h-4 mr-2" />
                  {round.team2.taker}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="text-gray-600">
        {currentRound > 5 ? 'Sudden Death' : `Round ${currentRound} of 5`}
      </div>
    </div>
  );
};