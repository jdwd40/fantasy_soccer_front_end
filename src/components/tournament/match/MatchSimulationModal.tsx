import React, { useState, useEffect } from 'react';
import { X, Timer, Play, Trophy } from 'lucide-react';
import type { TeamWithPlayers } from '../../../types/team';
import { generateMatchEvents } from '../../../utils/matchEventGenerator';
import { MatchEventLog } from './MatchEventLog';
import { MatchScore } from './MatchScore';
import { MatchClock } from './MatchClock';
import { PenaltyShootout } from './PenaltyShootout';

interface MatchSimulationModalProps {
  team1: TeamWithPlayers;
  team2: TeamWithPlayers;
  onClose: () => void;
  onMatchComplete: (result: any) => void;
}

type MatchPhase = 'FIRST_HALF' | 'HALF_TIME' | 'SECOND_HALF' | 'FULL_TIME' | 'EXTRA_TIME_FIRST' | 
                  'EXTRA_TIME_BREAK' | 'EXTRA_TIME_SECOND' | 'PENALTIES' | 'COMPLETE';

export const MatchSimulationModal: React.FC<MatchSimulationModalProps> = ({
  team1,
  team2,
  onClose,
  onMatchComplete,
}) => {
  const [currentMinute, setCurrentMinute] = useState(0);
  const [events, setEvents] = useState(generateMatchEvents(team1, team2));
  const [score, setScore] = useState({ team1: 0, team2: 0 });
  const [extraTimeScore, setExtraTimeScore] = useState({ team1: 0, team2: 0 });
  const [phase, setPhase] = useState<MatchPhase>('FIRST_HALF');
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentMinute(prev => {
        const newMinute = prev + 1;

        if (phase === 'FIRST_HALF' && newMinute === 45) {
          setIsPaused(true);
          setPhase('HALF_TIME');
        } else if (phase === 'SECOND_HALF' && newMinute === 90) {
          setIsPaused(true);
          if (score.team1 === score.team2) {
            setPhase('EXTRA_TIME_FIRST');
          } else {
            setPhase('FULL_TIME');
          }
        } else if (phase === 'EXTRA_TIME_FIRST' && newMinute === 105) {
          setIsPaused(true);
          setPhase('EXTRA_TIME_BREAK');
        } else if (phase === 'EXTRA_TIME_SECOND' && newMinute === 120) {
          setIsPaused(true);
          if (score.team1 + extraTimeScore.team1 === score.team2 + extraTimeScore.team2) {
            setPhase('PENALTIES');
          } else {
            setPhase('COMPLETE');
          }
        }

        return newMinute;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [phase, isPaused, score, extraTimeScore]);

  useEffect(() => {
    const currentEvents = events.filter(event => event.minute <= currentMinute);
    const goals = currentEvents.filter(event => event.isGoal);
    
    if (currentMinute <= 90) {
      setScore({
        team1: goals.filter(event => event.team === team1.team_id).length,
        team2: goals.filter(event => event.team === team2.team_id).length
      });
    } else {
      setExtraTimeScore({
        team1: goals.filter(event => event.team === team1.team_id && event.minute > 90).length,
        team2: goals.filter(event => event.team === team2.team_id && event.minute > 90).length
      });
    }
  }, [currentMinute, events, team1.team_id, team2.team_id]);

  const handleContinue = () => {
    switch (phase) {
      case 'HALF_TIME':
        setPhase('SECOND_HALF');
        setIsPaused(false);
        break;
      case 'EXTRA_TIME_FIRST':
        setCurrentMinute(90);
        setIsPaused(false);
        break;
      case 'EXTRA_TIME_BREAK':
        setPhase('EXTRA_TIME_SECOND');
        setIsPaused(false);
        break;
      case 'FULL_TIME':
      case 'COMPLETE':
        const winner = score.team1 > score.team2 ? team1 : team2;
        onMatchComplete({
          team1Score: score.team1,
          team2Score: score.team2,
          extraTime: phase === 'COMPLETE' ? extraTimeScore : undefined,
          winner
        });
        break;
    }
  };

  const handlePenaltyComplete = (penaltyResult: { team1Score: number; team2Score: number }) => {
    onMatchComplete({
      team1Score: score.team1,
      team2Score: score.team2,
      extraTime: extraTimeScore,
      penalties: penaltyResult,
      winner: penaltyResult.team1Score > penaltyResult.team2Score ? team1 : team2
    });
    setPhase('COMPLETE');
  };

  const getPhaseDisplay = () => {
    switch (phase) {
      case 'FIRST_HALF': return 'First Half';
      case 'HALF_TIME': return 'Half Time';
      case 'SECOND_HALF': return 'Second Half';
      case 'EXTRA_TIME_FIRST': return 'Extra Time (First Half)';
      case 'EXTRA_TIME_BREAK': return 'Extra Time Break';
      case 'EXTRA_TIME_SECOND': return 'Extra Time (Second Half)';
      case 'PENALTIES': return 'Penalty Shootout';
      case 'FULL_TIME':
      case 'COMPLETE': return 'Full Time';
      default: return '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="border-b px-6 py-4 flex items-center justify-between sticky top-0 bg-white">
          <h2 className="text-xl font-bold">Match Simulation - {getPhaseDisplay()}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <MatchScore 
            team1={team1} 
            team2={team2} 
            score={{
              team1: score.team1 + extraTimeScore.team1,
              team2: score.team2 + extraTimeScore.team2
            }}
          />

          {phase !== 'PENALTIES' ? (
            <>
              <MatchClock 
                currentMinute={currentMinute}
                isPaused={isPaused}
                isComplete={phase === 'COMPLETE' || phase === 'FULL_TIME'}
              />
              <MatchEventLog 
                events={events.filter(event => event.minute <= currentMinute)}
                team1={team1}
                team2={team2}
                className="mt-6"
              />
            </>
          ) : (
            <PenaltyShootout
              team1={team1}
              team2={team2}
              onComplete={handlePenaltyComplete}
            />
          )}
        </div>

        <div className="border-t px-6 py-4 flex justify-center sticky bottom-0 bg-white">
          {(phase === 'HALF_TIME' || phase === 'EXTRA_TIME_BREAK' || 
            phase === 'FULL_TIME' || phase === 'COMPLETE') && (
            <button
              onClick={handleContinue}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                       transition-colors flex items-center"
            >
              <Play className="w-5 h-5 mr-2" />
              {phase === 'FULL_TIME' || phase === 'COMPLETE' ? 'End Match' : 'Continue'}
            </button>
          )}
          {(phase === 'FIRST_HALF' || phase === 'SECOND_HALF' || 
            phase === 'EXTRA_TIME_FIRST' || phase === 'EXTRA_TIME_SECOND') && (
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700
                       transition-colors flex items-center"
            >
              <Timer className="w-5 h-5 mr-2" />
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};