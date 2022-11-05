package com.gberard.tournament.data.game.score;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.game.ContestantResult;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.ToString;

import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

import static com.gberard.tournament.data.game.ContestantResult.*;

// To Test
@EqualsAndHashCode
@ToString
@JsonSerialize(using = SetScoreSerializer.class)
@JsonDeserialize(using = SetScoreDeserializer.class)
public class SetScore implements Score {

    @Getter
    private List<GameScore> result;

    public SetScore(List<GameScore> result) {
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
    public static SetScore createSetScore(Contestant contestA, List<Integer> scoreA, Contestant contestB, List<Integer> scoreB) {
        if (scoreA.size() != scoreB.size()) {
            throw new IllegalStateException("Teams cannot have different number of scores");
        }

        return new SetScore(IntStream.range(0, scoreA.size())
                .mapToObj(index -> Map.of(contestA.id(), scoreA.get(index), contestB.id(), scoreB.get(index)))
                .map(GameScore::new)
                .toList());
    }
}