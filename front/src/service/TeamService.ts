import { Team } from "../data/Team";

// @ts-ignore
const api = ENV_API_URL;

export const fetchTeams: () => Promise<Team[]> = () => {
    return fetch(`${api}/api/teams`).then((res) => res.json());
};
