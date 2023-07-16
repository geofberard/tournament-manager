package com.gberard.tournament.data;

import java.util.Map;

import static com.gberard.tournament.data.ContestantResult.*;

public record DepthOneScore(Map<String, Integer> result) implements Score {
    @Override
    public String getSummary() {
        return null;
    }

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
                .mapToInt(key -> result.get(key))
                .sum();
    }

    @Override
    public ContestantResult getTeamStatus(String contestantId) {
        checkContestant(contestantId);

        if (getPointFor(contestantId) == getPointAgainst(contestantId)) {
            return DRAWN;
        }

        return getPointFor(contestantId) > getPointAgainst(contestantId) ? WIN : LOST;
    }

    private void checkContestant(String contestantId) {
        if (!result.containsKey(contestantId)) {
            throw new IllegalStateException("Contestant " + contestantId + " absent in score " + this);
        }
    }
}