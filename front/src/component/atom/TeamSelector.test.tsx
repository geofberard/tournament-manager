import { fireEvent, screen } from "@testing-library/react";
import * as React from "react";
import { Team } from "../../data/Team";
import { mockFunctionReturn, render, testSnapshot } from "../../test/TestUtils";
import { useCurrentTeam } from "../hook/CurrentTeamContext";
import { useTeams } from "../hook/useTeams";
import { TeamSelector } from "./TeamSelector";

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

describe("snapshot", () => {
    beforeEach(() => {
        mockFunctionReturn(useTeams, teamsMocked);
        mockFunctionReturn(useCurrentTeam, [undefined, jest.fn()]);
    });

    testSnapshot(<TeamSelector />);
});

describe("initializing", () => {
    it("should list all teams", () => {
        // Given
        mockFunctionReturn(useTeams, teamsMocked);
        mockFunctionReturn(useCurrentTeam, [undefined, jest.fn()]);

        // When
        render(<TeamSelector />);

        // Then
        const options = screen.getAllByRole("option") as HTMLOptionElement[];
        options.slice(1).forEach((option, index) => {
            expect(option.value).toBe(teamsMocked[index].id);
            expect(option.textContent).toBe(teamsMocked[index].name);
        });
    });

    it("should list all teams sorted", () => {
        // Given
        const unsortedTeamsMocked: Team[] = [teamsMocked[2], teamsMocked[0], teamsMocked[1]];
        mockFunctionReturn(useTeams, unsortedTeamsMocked);
        mockFunctionReturn(useCurrentTeam, [undefined, jest.fn()]);

        // When
        render(<TeamSelector />);

        // Then
        const options = screen.getAllByRole("option") as HTMLOptionElement[];
        options.slice(1).forEach((option, index) => {
            expect(option.value).toBe(teamsMocked[index].id);
            expect(option.textContent).toBe(teamsMocked[index].name);
        });
    });

    it("should contain an empty option", () => {
        // Given
        mockFunctionReturn(useTeams, teamsMocked);
        mockFunctionReturn(useCurrentTeam, [undefined, jest.fn()]);

        // When
        render(<TeamSelector />);

        // Then
        const options = screen.getAllByRole("option") as HTMLOptionElement[];
        expect(options[0].value).toBe("");
        expect(options[0].textContent).toBe("");
    });

    it("should have no value by default", () => {
        // Given
        mockFunctionReturn(useTeams, teamsMocked);
        mockFunctionReturn(useCurrentTeam, [undefined, jest.fn()]);

        // When
        render(<TeamSelector />);

        // Then
        const options = screen.getAllByRole("option") as HTMLOptionElement[];
        expect(options[0].selected).toBeTruthy();
        expect(options[1].selected).not.toBeTruthy();
        expect(options[2].selected).not.toBeTruthy();
        expect(options[3].selected).not.toBeTruthy();
    });

    it("should have no value by default", () => {
        // Given
        const selectedTeam = teamsMocked[1];
        mockFunctionReturn(useTeams, teamsMocked);
        mockFunctionReturn(useCurrentTeam, [selectedTeam, jest.fn()]);

        // When
        render(<TeamSelector />);

        // Then
        const options = screen.getAllByRole("option") as HTMLOptionElement[];
        expect(options[0].selected).not.toBeTruthy();
        expect(options[1].selected).not.toBeTruthy();
        expect(options[2].selected).toBeTruthy();
        expect(options[3].selected).not.toBeTruthy();
    });
});

describe("interaction", () => {
    it("should change current team on option selection ", () => {
        // Given
        const teamToSelect = teamsMocked[1];
        const setCurrentTeam = jest.fn();
        mockFunctionReturn(useTeams, teamsMocked);
        mockFunctionReturn(useCurrentTeam, [undefined, setCurrentTeam]);
        render(<TeamSelector />);

        // When
        fireEvent.change(screen.getByRole("combobox"), { target: { value: teamToSelect.id } });

        // Then
        expect(setCurrentTeam).toHaveBeenCalledWith(teamToSelect);
    });

    it("should reset current team on empty option selection ", () => {
        // Given
        const teamToSelect = teamsMocked[1];
        const setCurrentTeam = jest.fn();
        mockFunctionReturn(useTeams, teamsMocked);
        mockFunctionReturn(useCurrentTeam, [undefined, setCurrentTeam]);
        render(<TeamSelector />);

        // When
        fireEvent.change(screen.getByRole("combobox"), { target: { value: "" } });

        // Then
        expect(setCurrentTeam).toHaveBeenCalledWith(undefined);
    });
});
