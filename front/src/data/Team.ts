import { Contestant } from "./Contestant";
import { Player } from "./Player";

export interface Team extends Contestant{
    name: string;
    players: Player[];
}
