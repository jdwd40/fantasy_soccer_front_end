import { supabase } from '../config/supabase';
import type { TeamWithPlayers } from '../types/team';

export const calculateTeamRatings = (players: any[]) => {
  const sortedPlayers = [...players].sort((a, b) => {
    if (a.is_goalkeeper && !b.is_goalkeeper) return 1;
    if (!a.is_goalkeeper && b.is_goalkeeper) return -1;
    return 0;
  });

  const outfieldPlayers = sortedPlayers.filter(p => !p.is_goalkeeper);
  const goalkeeper = sortedPlayers.find(p => p.is_goalkeeper);

  const attackRating = Math.floor(outfieldPlayers.slice(0, 2).reduce((sum, p) => sum + p.attack, 0) / 2);
  const defenseRating = Math.floor(outfieldPlayers.slice(2, 4).reduce((sum, p) => sum + p.defense, 0) / 2);
  const goalkeeperRating = goalkeeper ? goalkeeper.defense : 0;

  return {
    attackRating,
    defenseRating,
    goalkeeperRating
  };
};

export const updateTournamentRecord = async (teamId: number, isWinner: boolean) => {
  try {
    console.log(`Updating tournament record for team ${teamId}, isWinner: ${isWinner}`);
    
    // First verify the team exists and get current stats
    const { data: currentTeam, error: fetchError } = await supabase
      .from('teams')
      .select('team_id, jcups_won, runner_ups')
      .eq('team_id', teamId)
      .single();

    if (fetchError) {
      console.error('Error fetching current team stats:', fetchError);
      throw fetchError;
    }

    if (!currentTeam) {
      throw new Error(`Team not found with ID: ${teamId}`);
    }

    // Log current values
    console.log('Current team stats:', currentTeam);

    const updates = {
      jcups_won: isWinner ? (currentTeam.jcups_won + 1) : currentTeam.jcups_won,
      runner_ups: isWinner ? currentTeam.runner_ups : (currentTeam.runner_ups + 1)
    };

    // Log the update payload
    console.log('Updating with:', updates);

    const { data: updateData, error: updateError } = await supabase
      .from('teams')
      .update(updates)
      .match({ team_id: teamId })
      .select();

    if (updateError) {
      console.error('Error updating team stats:', updateError);
      throw updateError;
    }

    // Log the response
    console.log('Update successful:', updateData);
    return true;
  } catch (error) {
    console.error('Error in updateTournamentRecord:', error);
    throw error;
  }
};

export const fetchTeams = async () => {
  try {
    const { data: teams, error: teamsError } = await supabase
      .from('teams')
      .select('*')
      .order('name');

    if (teamsError) throw teamsError;

    const { data: allPlayers, error: playersError } = await supabase
      .from('team_players')
      .select('*')
      .order('is_goalkeeper');

    if (playersError) throw playersError;

    const playersByTeam = allPlayers.reduce((acc: any, player) => {
      if (!acc[player.team_id]) {
        acc[player.team_id] = [];
      }
      acc[player.team_id].push({
        ...player,
        isGoalkeeper: player.is_goalkeeper
      });
      return acc;
    }, {});

    const teamsWithPlayers = teams.map(team => {
      const teamPlayers = playersByTeam[team.team_id] || [];
      const ratings = calculateTeamRatings(teamPlayers);
      return {
        ...team,
        ...ratings,
        players: teamPlayers
      };
    });

    return teamsWithPlayers;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const fetchTeamWithPlayers = async (teamId: number): Promise<TeamWithPlayers | null> => {
  try {
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('team_id', teamId)
      .single();

    if (teamError) throw teamError;

    const { data: players, error: playersError } = await supabase
      .from('team_players')
      .select('*')
      .eq('team_id', teamId)
      .order('is_goalkeeper');

    if (playersError) throw playersError;

    if (!team || !players) return null;

    const mappedPlayers = players.map(player => ({
      ...player,
      isGoalkeeper: player.is_goalkeeper
    }));

    const ratings = calculateTeamRatings(mappedPlayers);

    return {
      ...team,
      players: mappedPlayers,
      ...ratings
    };
  } catch (error) {
    console.error('Error fetching team with players:', error);
    throw error;
  }
};