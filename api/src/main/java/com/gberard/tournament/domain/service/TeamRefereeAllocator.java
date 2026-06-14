package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.scheduling.PlannedGame;
import com.gberard.tournament.domain.model.scheduling.TeamPair;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;

@Component
public class TeamRefereeAllocator {

    public List<PlannedGame> allocate(List<PlannedGame> plannedGames, List<Team> teams) {
        validateInputs(plannedGames, teams);

        Map<Team, Integer> assignments = new HashMap<>();
        Map<Team, Integer> teamOrder = new HashMap<>();
        for (int index = 0; index < teams.size(); index++) {
            assignments.put(teams.get(index), 0);
            teamOrder.put(teams.get(index), index);
        }

        List<PlannedGame> result = new ArrayList<>();
        for (int index = 0; index < plannedGames.size(); index++) {
            PlannedGame current = plannedGames.get(index);
            List<Team> previousContestants = index == 0
                    ? List.of()
                    : plannedGames.get(index - 1).teamPair().teams();
            List<Team> nextContestants = index == plannedGames.size() - 1
                    ? List.of()
                    : plannedGames.get(index + 1).teamPair().teams();

            Team referee = teams.stream()
                    .filter(team -> !current.teamPair().contains(team))
                    .min(Comparator
                            .comparingInt((Team team) -> assignments.get(team))
                            .thenComparing(team -> previousContestants.contains(team))
                            .thenComparing(team -> nextContestants.contains(team))
                            .thenComparingInt(teamOrder::get))
                    .orElseThrow(() -> new IllegalArgumentException(
                            "At least three teams are required to assign team referees"
                    ));

            assignments.compute(referee, (team, count) -> count + 1);
            result.add(current.withReferee(referee));
        }

        return List.copyOf(result);
    }

    private void validateInputs(List<PlannedGame> plannedGames, List<Team> teams) {
        if (plannedGames == null) {
            throw new IllegalArgumentException("plannedGames must not be null");
        }
        if (teams == null || teams.size() < 3) {
            throw new IllegalArgumentException("At least three teams are required to assign team referees");
        }
        if (teams.stream().anyMatch(java.util.Objects::isNull) || new HashSet<>(teams).size() != teams.size()) {
            throw new IllegalArgumentException("Teams must be non-null and unique");
        }
    }
}
