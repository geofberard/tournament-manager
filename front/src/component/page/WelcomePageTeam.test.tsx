import * as React from "react";
import { mockFunctionReturn, testSnapshot } from "../../test/TestUtils";
import { WelcomePageTeam } from "./WelcomePageTeam";
import {useGames} from "../hook/useGames";
import Game from "../../data/Game";
import { createRenderer } from "react-test-renderer/shallow";

jest.mock("../hook/useGames", () => ({
    useGames: jest.fn(),
}));

const teamA = { id: "teamA", name: "TeamA" };
const teamB = { id: "teamB", name: "TeamB" };
const teamC = { id: "teamC", name: "TeamC" };

const games: Game[] = [
    new Game({
        id: "gameId",
        time: expect.any(Date),
        court: "court",
        teamA: teamA,
        teamB: teamB,
        referee: teamC,
        scoreA: 25,
        scoreB: 14,
    }),
    new Game({
        id: "gameId",
        time: expect.any(Date),
        court: "court",
        teamA: teamA,
        teamB: teamB,
        referee: teamC,
        scoreA: 14,
        scoreB: 25,
    }),
    new Game({
        id: "gameId",
        time: expect.any(Date),
        court: "court",
        teamA: teamA,
        teamB: teamB,
        referee: teamC,
        scoreA: 22,
        scoreB: 22,
    })
    
];

mockFunctionReturn(useGames, games);
testSnapshot(<WelcomePageTeam />);


// describe("initializing", () => {
//     it("should match last snapshot", () => {
//         // Given
//         const renderer = createRenderer();

//         // When
//         const result = renderer.render(<WelcomePageTeam />);

//         // Then
//         expect(result).toMatchSnapshot();
//     });
// });

// {
//     time: expect.any(Date)
// }