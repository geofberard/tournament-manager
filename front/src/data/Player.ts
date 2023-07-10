import { Contestant } from "./Contestant";

export interface Player extends Contestant{
    firstName: string;
    lastName: string;
}
