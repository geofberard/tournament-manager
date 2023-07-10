import { Contestant } from "./Contestant";
import { Identified } from "./Identified";
import { ScoreType } from "./ScoreType";
import { Score } from "./Score";

export enum Result {
    WON = "WON",
    LOST = "LOST",
    DEUCE = "DEUCE",
    NOT_PLAYED = "NOT_PLAYED",
}

export default class Game implements Identified {

    id: string;
    time: Date;
    court: string;
    contestants: Contestant[];
    referee?: Contestant;
    isFinished: boolean;
    scoreType: ScoreType;
    score?: Score;


    // public constructor(init?:Partial<Game>) {
    //     Object.assign(this, init);
    // }

    // isFinished: () => boolean = () => !(this.scoreB == undefined || this.scoreA == undefined);

    // getResultGameByTeam = (team: Team): Result => {
    //     if(!this.isFinished()){
    //         return Result.NOT_PLAYED;
    //     }

    //     if(this.scoreA === this.scoreB) {
    //         return Result.DEUCE;
    //     } 

    //     if(this.scoreA > this.scoreB) {
    //         return (this.teamA === team) ? Result.WON : Result.LOST
    //     } 

    //     return (this.teamB === team) ? Result.WON : Result.LOST;

    // };

}

