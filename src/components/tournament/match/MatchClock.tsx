import React from 'react';
import { Timer } from 'lucide-react';

interface MatchClockProps {
  currentMinute: number;
  isPaused: boolean;
  isComplete: boolean;
}

export const MatchClock: React.FC<MatchClockProps> = ({
  currentMinute,
  isPaused,
  isComplete,
}) => {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="bg-gray-100 px-4 py-2 rounded-full flex items-center">
        <Timer className="w-4 h-4 mr-2 text-gray-600" />
        <span className="font-mono text-xl">
          {currentMinute.toString().padStart(2, '0')}:00
        </span>
        {isPaused && <span className="ml-2 text-yellow-600">(Paused)</span>}
        {isComplete && <span className="ml-2 text-green-600">(Complete)</span>}
      </div>
    </div>
  );
};