import { Team } from "./Team";

export interface TeamStats {
    team: Team;
    played: Number;
    won: Number;
    drawn: Number;
    lost: Number;
    score: Number;
    pointsFor: Number;
    pointsAgainst: Number;
    pointsDiff: Number;
}
