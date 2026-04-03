package com.gberard.tournament.domain.model.score;

import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.stats.TeamResult;

import java.util.Map;

public record SimpleScore(Map<String, Integer> result) {

    public int getPointFor(Team team) {
        checkTeam(team);
        return result.get(team.id());
    }

    public int getPointAgainst(Team team) {
        checkTeam(team);
        return result.keySet().stream()
                .filter(key -> !key.equals(team.id()))
                .mapToInt(result::get)
                .sum();
    }

    public TeamResult getTeamStatus(Team team) {
        checkTeam(team);

        if (getPointFor(team) == getPointAgainst(team)) {
            return TeamResult.DRAWN;
        }

        return getPointFor(team) > getPointAgainst(team) ? TeamResult.WIN : TeamResult.LOST;
    }

    public boolean hasTeam(Team team) {
        return result.containsKey(team.id());
    }

    private void checkTeam(Team team) {
        if (!hasTeam(team)) {
            throw new IllegalStateException("Team " + team.id() + " absent in score " + this);
        }
    }
}
