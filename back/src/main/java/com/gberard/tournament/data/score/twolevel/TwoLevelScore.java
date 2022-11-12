package com.gberard.tournament.data.score.twolevel;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.contestant.ContestantResult;
import com.gberard.tournament.data.score.Score;
import com.gberard.tournament.data.score.onelevel.OneLevelScore;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

import static com.gberard.tournament.data.contestant.ContestantResult.*;

@EqualsAndHashCode
@ToString
@JsonSerialize(using = TwoLevelScoreSerializer.class)
@JsonDeserialize(using = TwoLevelScoreDeserializer.class)
public class TwoLevelScore implements Score {

    @Getter
    private List<OneLevelScore> result;

    public TwoLevelScore(List<OneLevelScore> result) {
        this.result = result;
    }

    @Override
    public int getPointFor(String contestantId) {
        return result.stream()
                .mapToInt(game -> game.getPointFor(contestantId))
                .sum();
    }

    @Override
    public int getPointAgainst(String contestantId) {
        return result.stream()
                .mapToInt(game -> game.getPointAgainst(contestantId))
                .sum();
    }

    @Override
    public ContestantResult getTeamStatus(String contestantId) {
        long nbWonSets = result.stream()
                .filter(game -> game.getPointFor(contestantId) > game.getPointAgainst(contestantId))
                .count();

        long nbLostSets = result.stream()
                .filter(game -> game.getPointFor(contestantId) < game.getPointAgainst(contestantId))
                .count();

        if(nbWonSets == nbLostSets) {
            return DRAWN;
        }

        return nbWonSets > nbLostSets ? WIN : LOST;
    }

    @Builder
    public static TwoLevelScore createSetScore(Contestant contestA, List<Integer> scoreA, Contestant contestB, List<Integer> scoreB) {
        if (scoreA.size() != scoreB.size()) {
            throw new IllegalStateException("Teams cannot have different number of scores");
        }

        return new TwoLevelScore(IntStream.range(0, scoreA.size())
                .mapToObj(index -> Map.of(contestA.id(), scoreA.get(index), contestB.id(), scoreB.get(index)))
                .map(OneLevelScore::new)
                .toList());
    }
}