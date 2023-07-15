import { act, renderHook, RenderHookResult, waitFor } from "@testing-library/react";
import useSWR from "swr";
import { Team } from "../../data/Team";
import { fetchJson } from "../../service/PromiseService";
import { API_TEAMS } from "../../service/TeamService";
import { useTeams } from "./useTeams";

const MOCKED_TEAMS: Team[] = [
    { id: "team1", name: "team1", label: "team1 label", players: []},
    { id: "team2", name: "team2", label: "team2 label", players: []},
];

jest.mock("swr", () => ({
    default: jest.fn(),
}));

const mockedUseSWR = useSWR as jest.MockedFunction<typeof useSWR>;

mockedUseSWR.mockImplementation(() => ({
    data: MOCKED_TEAMS,
    mutate: undefined,
    isValidating: undefined,
}));

describe("initialization", () => {
    it("should init using API url", async () => {
        // Given
        let hook: RenderHookResult<Team[], {}>;

        // When
        act(() => {
            hook = renderHook(() => useTeams());
        });

        // Then
        await waitFor(() => {
            expect(useSWR).toHaveBeenCalledWith(API_TEAMS, expect.anything(), expect.anything());
        });
    });

    it("should init using fetchJson", async () => {
        // Given
        let hook: RenderHookResult<Team[], {}>;

        // When
        act(() => {
            hook = renderHook(() => useTeams());
        });

        // Then
        await waitFor(() => {
            expect(useSWR).toHaveBeenCalledWith(expect.anything(), fetchJson, expect.anything());
        });
    });

    it("should init using suspense", async () => {
        // Given
        let hook: RenderHookResult<Team[], {}>;

        // When
        act(() => {
            hook = renderHook(() => useTeams());
        });

        // Then
        await waitFor(() => {
            expect(useSWR).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
                suspense: true,
            });
        });
    });
});
