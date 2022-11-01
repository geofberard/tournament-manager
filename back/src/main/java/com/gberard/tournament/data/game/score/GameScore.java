package com.gberard.tournament.data.game.score;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.game.ContestantResult;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.util.List;
import java.util.Map;

import static com.gberard.tournament.data.game.ContestantResult.*;

@EqualsAndHashCode
@ToString
@JsonSerialize(using = GameScoreSerializer.class)
@JsonDeserialize(using = GameScoreDeserializer.class)
public class GameScore implements Score {

    @Getter
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
        if (!hasContestant(contestantId)) {
            throw new IllegalStateException("Contestant " + contestantId + " absent in score " + this);
        }

        return result.get(contestantId);
    }

    @Override
    public int getPointAgainst(String contestantId) {
        if (!hasContestant(contestantId)) {
            throw new IllegalStateException("Contestant " + contestantId + " absent in score " + this);
        }

        return getPointFor(opponents.get(contestantId));
    }

    @Override
    public ContestantResult getTeamStatus(String contestantId) {
        if (!hasContestant(contestantId)) {
            throw new IllegalStateException("Contestant " + contestantId + " absent in score " + this);
        }
        
        if (getPointFor(contestantId) == getPointAgainst(contestantId)) {
            return DRAWN;
        }

        return getPointFor(contestantId) > getPointAgainst(contestantId) ? WIN : LOST;
    }

    public boolean hasContestant(String contestantId) {
        return opponents.keySet().contains(contestantId);
    }

}