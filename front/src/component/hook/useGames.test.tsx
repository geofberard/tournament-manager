import { act, renderHook, RenderHookResult, waitFor } from "@testing-library/react";
import useSWR from "swr";
import Game from "../../data/Game";
import { API_GAMES, fetchGames } from "../../service/GameService";
import { useGames } from "./useGames";

const MOCKED_GAMES: Game[] = [
    new Game({ id: "game1"}),
    new Game({ id: "game2"})
];

jest.mock("swr", () => ({
    default: jest.fn(),
}));

const mockedUseSWR = useSWR as jest.MockedFunction<typeof useSWR>;

mockedUseSWR.mockImplementation(() => ({
    data: MOCKED_GAMES,
    mutate: undefined,
    isValidating: undefined,
}));

describe("initialization", () => {
    it("should init using API url", async () => {
        // Given
        let hook: RenderHookResult<Game[], {}>;

        // When
        act(() => {
            hook = renderHook(() => useGames());
        });

        // Then
        await waitFor(() => {
            expect(useSWR).toHaveBeenCalledWith(API_GAMES, expect.anything(), expect.anything());
        });
    });

    it("should init using fetchGames", async () => {
        // Given
        let hook: RenderHookResult<Game[], {}>;

        // When
        act(() => {
            hook = renderHook(() => useGames());
        });

        // Then
        await waitFor(() => {
            expect(useSWR).toHaveBeenCalledWith(expect.anything(), fetchGames, expect.anything());
        });
    });

    it("should init using suspense", async () => {
        // Given
        let hook: RenderHookResult<Game[], {}>;

        // When
        act(() => {
            hook = renderHook(() => useGames());
        });

        // Then
        await waitFor(() => {
            expect(useSWR).toHaveBeenCalledWith(expect.anything(), expect.anything(), {
                suspense: true,
            });
        });
    });
});
