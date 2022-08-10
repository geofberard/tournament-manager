import * as React from "react";
import { useEffect, useState } from "react";
import { Team } from "../../data/Team";
import { API_TEAMS } from "../../service/TeamService";
import useSWR from "swr";
import { fetchJson } from "../../service/PromiseService";

export const useTeams: () => Team[] = () =>
    useSWR<Team[]>(API_TEAMS, fetchJson, { suspense: true }).data;
