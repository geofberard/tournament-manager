import { Team } from "../data/Team";
import { getCookie, setCookie } from "./CookieService";
import { findById } from "./DataService";

// @ts-ignore
const api = process.env.ENV_API_URL || "";

export const getTeams: () => Promise<Team[]> = () =>
    fetch(`${api}/api/teams`).then((res) => res.json());

export const getTeam: (id: string) => Promise<Team> = async (id) => {
    const teams: Team[] = await getTeams();
    return findById(id, teams);
};

export const TEAM_CNAME = "team";

export const getCurrentTeam: () => Promise<Team> = async () => 
    await getTeam(getCookie(TEAM_CNAME));

export const setCurrentTeam = (team: Team | undefined) => 
    setCookie(TEAM_CNAME, team.id, 10);
