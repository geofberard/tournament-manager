import { DepthOneScore } from "./DepthOneScore";
import { Score } from "./Score";

export interface DepthTwoScore extends Score {
    result: DepthOneScore[];
}
