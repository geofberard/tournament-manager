import * as React from "react";
import Game from "../../data/Game";
import { render } from "../../test/TestUtils";
import { GameRow } from "./GameRow";
import { Team } from "../../data/Team";
import { ScoreType } from "../../data/ScoreType";
import { Score } from "../../data/Score";

const teamA: Team = { id: "teamA", name: "TeamA", label: "TeamA label", players: []};
const teamB: Team = { id: "teamB", name: "TeamB", label: "TeamB label", players: []};
const teamC: Team = { id: "teamC", name: "TeamC", label: "TeamC label", players: []};
const scoreGame1: Score = {summary: "3-0"};
const scoreGame3: Score = {summary: "0-0"};

const game = new Game({
    id: "gameId",
    time: expect.any(Date),
    court: "court",
    contestants: [teamA, teamB],
    referee: teamC,
    scoreType: ScoreType.DEPTH_ONE,
    score: scoreGame1,
})

const gameNotPlayed = new Game({
    id: "gameId",
    time: expect.any(Date),
    court: "court",
    contestants: [teamA, teamC],
    referee: teamC,
    scoreType: ScoreType.DEPTH_ONE
})
const gameDeuce = new Game({
    id: "gameId",
    time: expect.any(Date),
    court: "court",
    contestants: [teamB, teamC],
    referee: teamA,
    scoreType: ScoreType.DEPTH_ONE,
    score: scoreGame3,
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