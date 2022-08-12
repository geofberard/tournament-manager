import { Game } from "./Game";

export const gamePlayed = (game: Game): boolean => { 
    if (game.scoreB == 0 && game.scoreA == 0) {
        return false
    } else {
        return true
    } 
}

export const winner = (game: Game): string => {
    if (gamePlayed(game)) {
        if (game.scoreA > game.scoreB) {
            return game.teamA;
        } else if(game.scoreA === game.scoreB){
            return "deuce";
        } else {
            return game.teamB;
        }
    } else {
        return "not played"
    }
}

export const checkWinner = (game: Game, team: string) => {
    if (winner(game) === team) {
        return {color: "green"}
    } else if (winner(game) === "deuce") {
        return {color: "orange"}
    } else if ( winner(game) === "not played" ){
        return {color: "white"}
    } else {
        return {color: "grey"}
    }
}