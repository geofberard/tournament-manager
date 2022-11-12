package com.gberard.tournament.data.score.onelevel;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.contestant.ContestantResult;
import com.gberard.tournament.data.score.Score;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.util.List;
import java.util.Map;

import static com.gberard.tournament.data.contestant.ContestantResult.*;

@EqualsAndHashCode
@ToString
@JsonSerialize(using = OneLevelScoreSerializer.class)
@JsonDeserialize(using = OneLevelScoreDeserializer.class)
public class OneLevelScore implements Score {

    @Getter
    Map<String, Integer> result;

    @EqualsAndHashCode.Exclude
    private Map<String, String> opponents;

    public OneLevelScore(Map<String, Integer> score) {
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

    @Builder
    public static OneLevelScore createGameScore(Contestant contestA, int scoreA, Contestant contestB, int scoreB) {
        return new OneLevelScore(Map.of(contestA.id(), scoreA, contestB.id(), scoreB));
    }

}