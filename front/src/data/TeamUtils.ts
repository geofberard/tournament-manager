import { Team } from "./Team";

export const sortByName = (teamA: Team, teamB: Team) => `${teamA.name}`.localeCompare(teamB.name);
