import type { TeamWithPlayers } from './team';

export interface MatchResult {
  team1Score: number;
  team2Score: number;
  winner: TeamWithPlayers;
  extraTime?: {
    team1Score: number;
    team2Score: number;
  };
  penalties?: {
    team1Score: number;
    team2Score: number;
  };
}

export interface TournamentRecord {
  id: string;
  date: string;
  winner: TeamWithPlayers;
  runnerUp: TeamWithPlayers;
  finalScore: {
    regular: [number, number];
    extraTime?: [number, number];
    penalties?: [number, number];
  };
}

export interface Fixture {
  team1: TeamWithPlayers;
  team2: TeamWithPlayers;
  result?: MatchResult;
}

export interface Tournament {
  message: string;
  fixtures: Fixture[][];
  currentRound?: number;
  isSimulated?: boolean;
  winner?: TeamWithPlayers;
  runnerUp?: TeamWithPlayers;
  completed?: boolean;
}