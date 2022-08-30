import * as React from "react";
import Game from "../../data/Game";
import { render } from "../../test/TestUtils";
import { GameRow } from "./GameRow";

const teamA = { id: "teamA", name: "TeamA" };
const teamB = { id: "teamB", name: "TeamB" };
const teamC = { id: "teamC", name: "TeamC" };


const game = new Game({
    id: "gameId",
    time: expect.any(Date),
    court: "court",
    teamA: teamA,
    teamB: teamB,
    referee: teamC,
    scoreA: 25,
    scoreB: 14,
})
const gameNotPlayed = new Game({
    id: "gameId",
    time: expect.any(Date),
    court: "court",
    teamA: teamA,
    teamB: teamB,
    referee: teamC
})
const gameDeuce = new Game({
    id: "gameId",
    time: expect.any(Date),
    court: "court",
    teamA: teamA,
    teamB: teamB,
    referee: teamC,
    scoreA: 22,
    scoreB: 22,
})

describe("initializing", () => {
    it("should be green or grey", () => {
        // When
        const {container} = render(<GameRow game={game}/>);

        // Then
        const styleCellTeamA = window.getComputedStyle(container.querySelector('.teamA-cell'));
        const styleCellTeamB = window.getComputedStyle(container.querySelector('.teamB-cell'));
        expect(styleCellTeamA.color).toBe('green');
        expect(styleCellTeamB.color).toBe('grey');

    });
    it("should be white", () => {
        // When
        const {container} = render(<GameRow game={gameNotPlayed}/>);

        // Then
        const styleCellTeamA = window.getComputedStyle(container.querySelector('.teamA-cell'));
        const styleCellTeamB = window.getComputedStyle(container.querySelector('.teamB-cell'));
        expect(styleCellTeamA.color).toBe('white');
        expect(styleCellTeamB.color).toBe('white');

    });
    it("should be orange", () => {
        // When
        const {container} = render(<GameRow game={gameDeuce}/>);

        // Then
        const styleCellTeamA = window.getComputedStyle(container.querySelector('.teamA-cell'));
        const styleCellTeamB = window.getComputedStyle(container.querySelector('.teamB-cell'));
        expect(styleCellTeamA.color).toBe('orange');
        expect(styleCellTeamB.color).toBe('orange');

    });
});