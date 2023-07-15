import * as React from "react";
import Game from "../../data/Game";
import { render } from "../../test/TestUtils";
import { GameTable } from "./GameTable";
import { Team } from "../../data/Team";
import { ScoreType } from "../../data/ScoreType";
import { Score } from "../../data/Score";

const teamA: Team = { id: "teamA", name: "TeamA", label: "TeamA label", players: []};
const teamB: Team = { id: "teamB", name: "TeamB", label: "TeamB label", players: []};
const teamC: Team = { id: "teamC", name: "TeamC", label: "TeamC label", players: []};
const scoreGame1: Score = {summary: "3-0"};
const scoreGame2: Score = {summary: "1-3"};
const scoreGame3: Score = {summary: "0-0"};

const games: Game[] = [
    new Game({
        id: "gameId",
        time: expect.any(Date),
        court: "court",
        contestants: [teamA, teamB],
        referee: teamC,
        scoreType: ScoreType.DEPTH_ONE, 
        score: scoreGame1,
    }),
    new Game({
        id: "gameId",
        time: expect.any(Date),
        court: "court",
        contestants: [teamA, teamB],
        referee: teamC,
        scoreType: ScoreType.DEPTH_ONE, 
        score: scoreGame2,
    }),
    new Game({
        id: "gameId",
        time: expect.any(Date),
        court: "court",
        contestants: [teamA, teamB],
        referee: teamC,
        scoreType: ScoreType.DEPTH_ONE, 
        score: scoreGame3,
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