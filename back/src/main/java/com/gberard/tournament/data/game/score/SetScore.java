package com.gberard.tournament.data.game.score;

import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.gberard.tournament.data.game.ContestantResult;
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

}