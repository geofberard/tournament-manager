package com.gberard.tournament.domain.model.score;

import com.gberard.tournament.domain.model.stats.ContestantResult;

import java.util.Map;

public record DepthOneScore(Map<String, Integer> result) implements Score {

    @Override
    public int getPointFor(String contestantId) {
        checkContestant(contestantId);
        return result.get(contestantId);
    }

    @Override
    public int getPointAgainst(String contestantId) {
        checkContestant(contestantId);
        return result.keySet().stream()
                .filter(key -> !key.equals(contestantId))
                .mapToInt(result::get)
                .sum();
    }

    @Override
    public ContestantResult getTeamStatus(String contestantId) {
        checkContestant(contestantId);

        if (getPointFor(contestantId) == getPointAgainst(contestantId)) {
            return ContestantResult.DRAWN;
        }

        return getPointFor(contestantId) > getPointAgainst(contestantId) ? ContestantResult.WIN : ContestantResult.LOST;
    }

    private void checkContestant(String contestantId) {
        if (!result.containsKey(contestantId)) {
            throw new IllegalStateException("Contestant " + contestantId + " absent in score " + this);
        }
    }
}
