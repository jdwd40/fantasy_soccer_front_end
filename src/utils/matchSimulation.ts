import type { Team, Fixture, MatchResult } from '../types/tournament';

const calculateGoals = (attack: number, opposingDefense: number, opposingGoalkeeper: number): number => {
  // Calculate base chance using attack vs combined defense and goalkeeper
  const totalDefense = (opposingDefense + opposingGoalkeeper) / 2;
  const baseChance = (attack - totalDefense) / 8;
  const randomFactor = Math.random() * 3;
  return Math.max(0, Math.floor(baseChance + randomFactor));
};

const simulateExtraTime = (team1: Team, team2: Team): { team1Score: number; team2Score: number } => {
  const team1Score = Math.floor(calculateGoals(team1.attackRating, team2.defenseRating, team2.goalkeeperRating) * 0.5);
  const team2Score = Math.floor(calculateGoals(team2.attackRating, team1.defenseRating, team1.goalkeeperRating) * 0.5);
  return { team1Score, team2Score };
};

const simulatePenalties = (): { team1Score: number; team2Score: number } => {
  let team1Score = 0;
  let team2Score = 0;
  
  // Initial 5 penalties each
  for (let i = 0; i < 5; i++) {
    if (Math.random() > 0.35) team1Score++;
    if (Math.random() > 0.35) team2Score++;
  }
  
  // Sudden death if tied
  while (team1Score === team2Score) {
    if (Math.random() > 0.4) team1Score++;
    if (team1Score > team2Score) break;
    if (Math.random() > 0.4) team2Score++;
  }
  
  return { team1Score, team2Score };
};

export const simulateMatch = (team1: Team, team2: Team): MatchResult => {
  const team1Score = calculateGoals(team1.attackRating, team2.defenseRating, team2.goalkeeperRating);
  const team2Score = calculateGoals(team2.attackRating, team1.defenseRating, team1.goalkeeperRating);
  
  let result: MatchResult = {
    team1Score,
    team2Score,
    winner: team1 // placeholder, will be set correctly below
  };
  
  // If drawn after regular time
  if (team1Score === team2Score) {
    result.extraTime = simulateExtraTime(team1, team2);
    
    const totalTeam1 = team1Score + result.extraTime.team1Score;
    const totalTeam2 = team2Score + result.extraTime.team2Score;
    
    // If still drawn after extra time
    if (totalTeam1 === totalTeam2) {
      result.penalties = simulatePenalties();
      result.winner = result.penalties.team1Score > result.penalties.team2Score ? team1 : team2;
    } else {
      result.winner = totalTeam1 > totalTeam2 ? team1 : team2;
    }
  } else {
    result.winner = team1Score > team2Score ? team1 : team2;
  }
  
  return result;
};

export const simulateRound = (fixtures: Fixture[]): Fixture[] => {
  return fixtures.map(fixture => ({
    ...fixture,
    result: simulateMatch(fixture.team1, fixture.team2)
  }));
};

export const generateNextRound = (fixtures: Fixture[]): Fixture[] => {
  const winners = fixtures.map(fixture => fixture.result!.winner);
  const nextRoundFixtures: Fixture[] = [];

  for (let i = 0; i < winners.length; i += 2) {
    if (i + 1 < winners.length) {
      nextRoundFixtures.push({
        team1: winners[i],
        team2: winners[i + 1]
      });
    }
  }

  return nextRoundFixtures;
};