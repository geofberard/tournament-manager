import Game from "../data/Game";
import { fetchGames } from "./GameService";
import { fetchJson } from "./PromiseService";

jest.mock("./PromiseService", () => ({
    fetchJson: jest.fn(),
}));

const MOCK_GAMES_PAYLOAD: Partial<Game>[] = [{ id: "Game1" }, { id: "Game2" }]

const mockedFetchGames = fetchJson as jest.MockedFunction<typeof fetchJson>;
mockedFetchGames.mockImplementation(() => Promise.resolve(MOCK_GAMES_PAYLOAD))

describe('fetchJson', () => {

    it('should use the right url', async () => {
        // Given
        const apiPath = "api/test";

        // When
        const games = await fetchGames(apiPath);

        // Then
        expect(mockedFetchGames).toHaveBeenCalledWith(apiPath);
    })

    it('should map json to objects of game Class', async () => {
        // When
        const games = await fetchGames("api/test");

        // Then
        games.forEach(game => expect(game).toBeInstanceOf(Game));
    })

})
