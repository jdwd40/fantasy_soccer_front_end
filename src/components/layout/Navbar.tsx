import React, { useState, useRef, useEffect } from 'react';
import { Trophy, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchTeams } from '../../services/teamService';
import { TeamDetailsModal } from '../TeamDetailsModal';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: teams, isLoading, error } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="bg-blue-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Trophy className="w-8 h-8 text-yellow-500 mr-3" />
              <span className="font-bold text-xl">Fantasy Soccer League</span>
            </div>
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 bg-blue-800 px-4 py-2 rounded-lg
                         hover:bg-blue-700 transition-colors duration-200"
              >
                <span>Select Team</span>
                <ChevronDown className={`w-5 h-5 transform transition-transform duration-200
                                    ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50
                              border border-gray-200 py-1 max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="px-4 py-2 text-gray-600">Loading teams...</div>
                  ) : error ? (
                    <div className="px-4 py-2 text-red-600">Error loading teams</div>
                  ) : teams?.length === 0 ? (
                    <div className="px-4 py-2 text-gray-600">No teams found</div>
                  ) : (
                    teams?.map((team) => (
                      <button
                        key={team.team_id}
                        onClick={() => {
                          setSelectedTeamId(team.team_id);
                          setIsOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50
                                 transition-colors duration-200"
                      >
                        {team.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {selectedTeamId && (
        <TeamDetailsModal
          teamId={selectedTeamId}
          onClose={() => setSelectedTeamId(null)}
        />
      )}
    </>
  );
};