package com.gberard.tournament.domain.model.score;

import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.stats.ContestantResult;

import java.util.List;

public record DepthTwoScore(List<DepthOneScore> result) implements Score {

    @Override
    public int getPointFor(Team team) {
        return result.stream()
                .mapToInt(game -> game.getPointFor(team))
                .sum();
    }

    @Override
    public int getPointAgainst(Team team) {
        return result.stream()
                .mapToInt(game -> game.getPointAgainst(team))
                .sum();
    }

    @Override
    public ContestantResult getTeamStatus(Team team) {
        long nbWonSets = result.stream()
                .map(depthOne -> depthOne.getTeamStatus(team))
                .filter(ContestantResult.WIN::equals)
                .count();

        long nbLostSets = result.stream()
                .map(depthOne -> depthOne.getTeamStatus(team))
                .filter(ContestantResult.LOST::equals)
                .count();

        if(nbWonSets == nbLostSets) {
            return ContestantResult.DRAWN;
        }

        return nbWonSets > nbLostSets ? ContestantResult.WIN : ContestantResult.LOST;
    }
}
