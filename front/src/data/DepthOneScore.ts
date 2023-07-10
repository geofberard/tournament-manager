import { Score } from "./Score";

export interface DepthOneScore extends Score {
    result: {[key:string]:Number};
}
