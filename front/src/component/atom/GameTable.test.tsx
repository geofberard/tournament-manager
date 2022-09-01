import * as React from "react";
import Game from "../../data/Game";
import { render } from "../../test/TestUtils";
import { GameTable } from "./GameTable";


const teamA = { id: "teamA", name: "TeamA" };
const teamB = { id: "teamB", name: "TeamB" };
const teamC = { id: "teamC", name: "TeamC" };

const games: Game[] = [
    new Game({
        id: "gameId",
        time: new Date(),
        court: "court",
        teamA: teamA,
        teamB: teamB,
        referee: teamC,
        scoreA: 25,
        scoreB: 14,
    }),
    new Game({
        id: "gameId",
        time: new Date(),
        court: "court",
        teamA: teamA,
        teamB: teamB,
        referee: teamC,
        scoreA: 14,
        scoreB: 25,
    }),
    new Game({
        id: "gameId",
        time: new Date(),
        court: "court",
        teamA: teamA,
        teamB: teamB,
        referee: teamC,
        scoreA: 22,
        scoreB: 22,
    })
];

describe("initializing", () => {
    it("should list all given games", () => {
        // When
        const {container} = render(<GameTable games={games}/>);

        // Then
        const expecetedLength = games.length;
        const realLength = container.getElementsByClassName('row-game').length

        expect(realLength).toBe(expecetedLength);
    });
});