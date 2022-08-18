import * as React from "react";
import { mockFunctionReturn, testSnapshot } from "../../test/TestUtils";
import { CompetitionBoard } from "./CompetitionBoard";
import {useCurrentTeam} from "../hook/CurrentTeamContext";
import {useTeams} from "../hook/useTeams";
import {Team} from "../../data/Team";

const teamsMocked: Team[] = [
    { id: "team1", name: "Team1" },
    { id: "team2", name: "Team2" },
    { id: "team3", name: "Team3" },
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
