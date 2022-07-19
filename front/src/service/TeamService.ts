import { Team } from "../data/Team";
import { getCookie, setCookie } from "./CookieService";
import { parseElementId } from "./DataService";

// @ts-ignore
const api = ENV_API_URL;

export const fetchTeams: () => Promise<Team[]> = () =>
  fetch(`${api}/api/teams`).then((res) => res.json());

const TEAM_CNAME = "team";

export const fetchTeamsAsync: () => Promise<Team[]> = async () => {
  try {
    const res = await fetch(`${api}/api/teams`);
    return await res.json();
  }
  catch (error) {
    console.log(error);
  }
}

export const parseTeamId: (id: string) => Promise<Team> = async (id) => {
  const teams: Team[] = await fetchTeamsAsync();
  return parseElementId(id, teams);
};

export const getCurrentTeam: () => Promise<Team> = async () => 
  await parseTeamId(getCookie(TEAM_CNAME));

export const setCurrentTeam = (team: Team | undefined) => {
  setCookie(TEAM_CNAME, team.id, 10);
};
