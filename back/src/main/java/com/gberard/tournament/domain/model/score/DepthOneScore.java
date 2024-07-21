package com.gberard.tournament.domain.model.score;

import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.stats.ContestantResult;

import java.util.Map;

public record DepthOneScore(Map<String, Integer> result) implements Score {

    @Override
    public int getPointFor(Team team) {
        checkContestant(team);
        return result.get(team.id());
    }

    @Override
    public int getPointAgainst(Team team) {
        checkContestant(team);
        return result.keySet().stream()
                .filter(key -> !key.equals(team.id()))
                .mapToInt(result::get)
                .sum();
    }

    @Override
    public ContestantResult getTeamStatus(Team team) {
        checkContestant(team);

        if (getPointFor(team) == getPointAgainst(team)) {
            return ContestantResult.DRAWN;
        }

        return getPointFor(team) > getPointAgainst(team) ? ContestantResult.WIN : ContestantResult.LOST;
    }

    private void checkContestant(Team team) {
        if (!result.containsKey(team.id())) {
            throw new IllegalStateException("Contestant " + team.id() + " absent in score " + this);
        }
    }
}
