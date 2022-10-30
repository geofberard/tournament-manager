package com.gberard.tournament.data.game.score;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.gberard.tournament.data.game.ContestantResult;
import lombok.EqualsAndHashCode;

import java.util.List;
import java.util.Map;

import static com.gberard.tournament.data.game.ContestantResult.*;

@EqualsAndHashCode
@JsonSerialize(using = GameScoreSerializer.class)
public class GameScore implements Score {

    Map<String, Integer> result;

    @EqualsAndHashCode.Exclude
    private Map<String, String> opponents;

    public GameScore(Map<String, Integer> score) {
        this.result = score;
        List<String> contestantIds = List.copyOf(score.keySet());
        this.opponents = Map.of(
                contestantIds.get(0), contestantIds.get(1),
                contestantIds.get(1), contestantIds.get(0)
        );
    }

    @Override
    public int getPointFor(String contestantId) {
        return result.get(contestantId);
    }

    @Override
    public int getPointAgainst(String contestantId) {
        return getPointFor(opponents.get(contestantId));
    }

    @Override
    public ContestantResult getTeamStatus(String contestantId) {
        if (getPointFor(contestantId) == getPointAgainst(contestantId)) {
            return DRAWN;
        }

        return getPointFor(contestantId) > getPointAgainst(contestantId) ? WIN : LOST;
    }

}