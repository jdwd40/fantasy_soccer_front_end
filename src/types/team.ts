export interface Player {
  name: string;
  attack: number;
  defense: number;
  is_goalkeeper: boolean;
  isGoalkeeper: boolean; // Frontend property mapped from is_goalkeeper
}

export interface TeamWithPlayers {
  team_id: number;
  name: string;
  wins: number;
  losses: number;
  goals_for: number;
  goals_against: number;
  jcups_won: number;
  runner_ups: number;
  players: Player[];
  attackRating: number;
  defenseRating: number;
  goalkeeperRating: number;
}

export interface Team {
  id: number;
  name: string;
  attackRating: number;
  defenseRating: number;
  goalkeeperRating: number;
  wins: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  jcups_won: number;
  runner_ups: number;
}