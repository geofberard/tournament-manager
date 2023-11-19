package com.gberard.tournament.domain.model.score;

import com.gberard.tournament.domain.model.stats.ContestantResult;

import java.util.List;

public record DepthTwoScore(List<DepthOneScore> result) implements Score {

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
                .filter(ContestantResult.WIN::equals)
                .count();

        long nbLostSets = result.stream()
                .map(depthOne -> depthOne.getTeamStatus(contestantId))
                .filter(ContestantResult.LOST::equals)
                .count();

        if(nbWonSets == nbLostSets) {
            return ContestantResult.DRAWN;
        }

        return nbWonSets > nbLostSets ? ContestantResult.WIN : ContestantResult.LOST;
    }
}
