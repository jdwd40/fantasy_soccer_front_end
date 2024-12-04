import React from 'react';
import type { TeamWithPlayers } from '../../../types/team';
import type { MatchEvent } from '../../../utils/matchEventGenerator';
import { Goal, Shield, AlertTriangle, Flag, CornerUpRight, UserMinus, Heart, Target } from 'lucide-react';

interface MatchEventLogProps {
  events: MatchEvent[];
  team1: TeamWithPlayers;
  team2: TeamWithPlayers;
  className?: string;
}

export const MatchEventLog: React.FC<MatchEventLogProps> = ({ events, team1, team2, className = '' }) => {
  const getTeamName = (teamId: number) => {
    return teamId === team1.team_id ? team1.name : team2.name;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'GOAL':
        return <Goal className="w-4 h-4 text-green-500" />;
      case 'SAVE':
        return <Shield className="w-4 h-4 text-blue-500" />;
      case 'SHOT':
        return <Target className="w-4 h-4 text-orange-500" />;
      default:
        return null;
    }
  };

  const getEventClass = (importance: string) => {
    switch (importance) {
      case 'HIGH':
        return 'bg-green-50 border-l-4 border-green-400';
      case 'MEDIUM':
        return 'bg-blue-50 border-l-4 border-blue-400';
      case 'LOW':
        return 'bg-gray-50';
      default:
        return 'bg-white';
    }
  };

  // Get all goals for the score summary
  const goals = events.filter(event => event.isGoal).map(event => ({
    minute: event.minute,
    scorer: event.player,
    team: getTeamName(event.team)
  }));

  return (
    <div className={`bg-white rounded-lg p-4 ${className}`}>
      {/* Score Summary */}
      {goals.length > 0 && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg">
          <h3 className="font-semibold mb-2">Scorers:</h3>
          <div className="space-y-1">
            {goals.map((goal, idx) => (
              <div key={idx} className="text-sm">
                <span className="font-medium">{goal.scorer}</span>
                <span className="text-gray-600"> ({goal.team}) </span>
                <span className="text-gray-500">{goal.minute}'</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Event Log */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        {events.slice().reverse().map((event, index) => (
          <div
            key={index}
            className={`flex items-center space-x-3 p-2 rounded-lg shadow-sm ${getEventClass(event.importance)}`}
          >
            <span className="font-mono text-sm text-gray-500 min-w-[45px]">
              {event.minute.toString().padStart(2, '0')}:00
            </span>
            {getEventIcon(event.type)}
            <span className="flex-1">
              <span className="font-semibold">{getTeamName(event.team)}</span>
              {' - '}
              {event.description}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};