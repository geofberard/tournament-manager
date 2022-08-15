import useSWR from "swr";
import { Team } from "../../data/Team";
import { fetchJson } from "../../service/PromiseService";
import { API_TEAMS } from "../../service/TeamService";

export const useTeams: () => Team[] = () =>
    useSWR<Team[]>(API_TEAMS, fetchJson, { suspense: true }).data;
