import { Team } from "../data/Team";
import { getCookie, setCookie } from "./CookieService";
import { findById } from "./DataService";

// @ts-ignore
const api = process.env.ENV_API_URL || "";

export const API_TEAMS = `/api/teams`;

export const TEAM_CNAME = "team";

export const getCurrentTeam: () => Team = () => JSON.parse(getCookie(TEAM_CNAME));

export const setCurrentTeam = (team: Team | undefined) =>
    setCookie(TEAM_CNAME, JSON.stringify(team), 10);
