import type { Team, TeamWithPlayers } from '../types/team';

export interface MatchEvent {
  minute: number;
  type: 'GOAL' | 'SHOT' | 'SAVE' | 'FOUL' | 'CARD' | 'CORNER' | 'OFFSIDE' | 'SUBSTITUTION' | 'INJURY' | 'POST' | 'CROSSBAR';
  team: number;
  description: string;
  player?: string;
  assist?: string;
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
  isGoal?: boolean;
}

const eventDescriptions = {
  GOAL: [
    (player: string, assist?: string) => ({
      text: `${player} scores${assist ? ` from ${assist}'s assist` : ''}!`,
      importance: 'HIGH' as const,
      isGoal: true
    }),
    (player: string) => ({
      text: `GOAL! Brilliant finish by ${player}!`,
      importance: 'HIGH' as const,
      isGoal: true
    }),
  ],
  SAVE: [
    (player: string) => ({
      text: `Great save by ${player}`,
      importance: 'MEDIUM' as const
    }),
    (player: string) => ({
      text: `${player} denies with a spectacular save`,
      importance: 'MEDIUM' as const
    }),
  ],
  SHOT: [
    (player: string) => ({
      text: `${player} fires a shot but misses`,
      importance: 'LOW' as const
    }),
    (player: string) => ({
      text: `Close attempt by ${player}`,
      importance: 'LOW' as const
    }),
  ]
};

const getRandomPlayer = (team: TeamWithPlayers, type: string): string => {
  if (type === 'SAVE') {
    const goalkeeper = team.players.find(p => p.is_goalkeeper);
    return goalkeeper?.name || 'Goalkeeper';
  }
  
  // For attacking actions, use forwards (first two players)
  if (type === 'GOAL' || type === 'SHOT') {
    const forwards = team.players.slice(0, 2);
    return forwards[Math.floor(Math.random() * forwards.length)].name;
  }
  
  // For other actions, use any outfield player
  const outfieldPlayers = team.players.filter(p => !p.is_goalkeeper);
  return outfieldPlayers[Math.floor(Math.random() * outfieldPlayers.length)].name;
};

export const generateMatchEvents = (team1: TeamWithPlayers, team2: TeamWithPlayers): MatchEvent[] => {
  const events: MatchEvent[] = [];
  let lastEventMinute = 0;

  const getAttackMultiplier = (attackingTeam: TeamWithPlayers, defendingTeam: TeamWithPlayers) => {
    const ratingDiff = attackingTeam.attackRating - defendingTeam.defenseRating;
    return 1 + (ratingDiff / 100);
  };

  for (let minute = 1; minute <= 90; minute++) {
    if (minute - lastEventMinute < 2) continue;

    const eventChance = Math.random();
    const attackingTeam = Math.random() < 0.5 ? team1 : team2;
    const defendingTeam = attackingTeam === team1 ? team2 : team1;
    const attackMultiplier = getAttackMultiplier(attackingTeam, defendingTeam);

    if (eventChance < 0.15 * attackMultiplier) {
      const shotOutcome = Math.random();
      
      if (shotOutcome < 0.2) {
        const scorer = getRandomPlayer(attackingTeam, 'GOAL');
        const assist = Math.random() > 0.5 ? getRandomPlayer(attackingTeam, 'GOAL') : undefined;
        const description = eventDescriptions.GOAL[Math.floor(Math.random() * eventDescriptions.GOAL.length)](scorer, assist);
        
        events.push({
          minute,
          type: 'GOAL',
          team: attackingTeam.team_id,
          description: description.text,
          player: scorer,
          assist,
          importance: description.importance,
          isGoal: true
        });
      } else if (shotOutcome < 0.6) {
        const keeper = getRandomPlayer(defendingTeam, 'SAVE');
        const description = eventDescriptions.SAVE[Math.floor(Math.random() * eventDescriptions.SAVE.length)](keeper);
        
        events.push({
          minute,
          type: 'SAVE',
          team: defendingTeam.team_id,
          description: description.text,
          player: keeper,
          importance: description.importance
        });
      } else {
        const shooter = getRandomPlayer(attackingTeam, 'SHOT');
        const description = eventDescriptions.SHOT[Math.floor(Math.random() * eventDescriptions.SHOT.length)](shooter);
        
        events.push({
          minute,
          type: 'SHOT',
          team: attackingTeam.team_id,
          description: description.text,
          player: shooter,
          importance: description.importance
        });
      }
      
      lastEventMinute = minute;
    }
  }

  return events.sort((a, b) => a.minute - b.minute);
};