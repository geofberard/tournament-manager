import * as React from "react";
import { testSnapshot } from "../../test/TestUtils";
import { GameList } from "./GameList";
import Game from "../../data/Game";

const teamA = { id: "teamA", name: "TeamA" };
const teamB = { id: "teamB", name: "TeamB" };
const teamC = { id: "teamC", name: "TeamC" };

const games: Game[] = [
    new Game({
        id: "gameId",
        time: new Date("2022-08-19 15:00"),
        court: "court",
        teamA: teamA,
        teamB: teamB,
        referee: teamC,
        scoreA: 25,
        scoreB: 14,
    }),
    new Game({
        id: "gameId",
        time: new Date("2022-08-19 16:00"),
        court: "court",
        teamA: teamA,
        teamB: teamB,
        referee: teamC,
        scoreA: 14,
        scoreB: 25,
    }),
    new Game({
        id: "gameId",
        time: new Date("2022-08-19 17:00"),
        court: "court",
        teamA: teamA,
        teamB: teamB,
        referee: teamC,
        scoreA: 22,
        scoreB: 22,
    })
    
];


testSnapshot(<GameList title="test" games={games} />);
