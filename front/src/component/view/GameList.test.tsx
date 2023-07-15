import * as React from "react";
import { testSnapshot } from "../../test/TestUtils";
import { GameList } from "./GameList";
import Game from "../../data/Game";
import { Team } from "../../data/Team";
import { Score } from "../../data/Score";
import { ScoreType } from "../../data/ScoreType";

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


testSnapshot(<GameList title="test" games={games} />);
