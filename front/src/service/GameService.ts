import Game from "../data/Game";
import { fetchJson } from "./PromiseService";

export const API_GAMES = "/api/games";

export const fetchGames = (api: string) => fetchJson(api)
    .then((gamesData: Partial<Game>[]) => {
        console.log(gamesData);
        return gamesData.map(gameData => new Game(gameData));
    });
