package com.gberard.tournament.data;

import java.util.List;

import static com.gberard.tournament.data.ContestantResult.*;

public record DepthTwoScore(List<DepthOneScore> result) implements Score {
    @Override
    public String getSummary() {
        return null;
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
                .map(depthOne -> depthOne.getTeamStatus(contestantId))
                .filter(WIN::equals)
                .count();

        long nbLostSets = result.stream()
                .map(depthOne -> depthOne.getTeamStatus(contestantId))
                .filter(LOST::equals)
                .count();

        if(nbWonSets == nbLostSets) {
            return DRAWN;
        }

        return nbWonSets > nbLostSets ? WIN : LOST;
    }
}