import { Identified } from "./Identified";

// @Patator: il faudra faire en sorte de ne pas transmettre le label, mais de le calculer avec une méthode de classe
export interface Contestant extends Identified{
    label: string;
}