import * as React from "react";
import { mockFunctionReturn, testSnapshot } from "../../test/TestUtils";
import { CompetitionBoard } from "./CompetitionBoard";
import {useCurrentTeam} from "../hook/CurrentTeamContext";
import {useTeams} from "../hook/useTeams";
import {Team} from "../../data/Team";

const teamsMocked: Team[] = [
    { id: "teamA", name: "TeamA", label: "TeamA label", players: []},
    { id: "teamB", name: "TeamB", label: "TeamB label", players: []},
    { id: "teamC", name: "TeamC", label: "TeamC label", players: []},
];

jest.mock("../hook/CurrentTeamContext", () => ({
    useCurrentTeam: jest.fn(),
}));

jest.mock("../hook/useTeams", () => ({
    useTeams: jest.fn(),
}));

mockFunctionReturn(useTeams, teamsMocked);
mockFunctionReturn(useCurrentTeam, [teamsMocked[0], jest.fn()]);

testSnapshot(<CompetitionBoard />);
