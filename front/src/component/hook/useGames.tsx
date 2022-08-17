import useSWR from "swr";
import Game from "../../data/Game";
import { API_GAMES, fetchGames } from "../../service/GameService";

export const useGames: () => Game[] = () =>
    useSWR<Game[]>(API_GAMES, fetchGames, { suspense: true }).data;
