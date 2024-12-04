import type { TeamWithPlayers, Team } from '../types/team';
import type { Fixture } from '../types/tournament';
import { fetchTeams } from '../services/teamService';

const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    for (let j = 0; j < 3; j++) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[i]];
    }
  }
  return shuffled;
};

const createFixturePairs = (allTeams: TeamWithPlayers[]): Fixture[] => {
  let shuffledTeams = shuffleArray([...allTeams]);
  
  // Split teams based on their attack ratings
  const strongerTeams = shuffledTeams.slice(0, 8);
  const weakerTeams = shuffledTeams.slice(8);
  
  strongerTeams.sort(() => Math.random() - 0.5);
  weakerTeams.sort(() => Math.random() - 0.5);
  
  const fixtures: Fixture[] = [];
  
  for (let i = 0; i < 8; i++) {
    if (Math.random() > 0.5) {
      fixtures.push({
        team1: strongerTeams[i],
        team2: weakerTeams[i]
      });
    } else {
      fixtures.push({
        team1: weakerTeams[i],
        team2: strongerTeams[i]
      });
    }
  }
  
  return shuffleArray(fixtures);
};

export const generateInitialFixtures = async (): Promise<Fixture[][]> => {
  const teams = await fetchTeams();
  const fixtures = createFixturePairs(teams);
  return [shuffleArray(fixtures)];
};

export const getInitialTournamentState = async () => {
  return {
    message: "Tournament Round of 16 - Knockout Stage",
    fixtures: await generateInitialFixtures(),
    currentRound: 0,
    isSimulated: false
  };
};