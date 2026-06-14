package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.scheduling.TeamPair;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Component
public class RoundRobinTeamPairGenerator {

    public List<TeamPair> generate(List<Team> teams) {
        validateTeams(teams);

        List<Team> rotation = prepareRotationTeams(teams);
        List<TeamPair> teamPairs = new ArrayList<>();

        for (int round = 0; round < rotation.size() - 1; round++) {
            teamPairs.addAll(createRoundPairs(rotation));
            offsetRotationTeams(rotation);
        }

        return List.copyOf(teamPairs);
    }

    private List<TeamPair> createRoundPairs(List<Team> rotation) {
        List<TeamPair> roundPairs = new ArrayList<>();
        int gamesPerRound = rotation.size() / 2;

        for (int index = 0; index < gamesPerRound; index++) {
            Team first = rotation.get(index);
            int opponentIndex = rotation.size() - 1 - index;
            Team opponent = rotation.get(opponentIndex);

            if (first != null && opponent != null) {
                roundPairs.add(new TeamPair(first, opponent));
            }
        }

        return roundPairs;
    }

    private void validateTeams(List<Team> teams) {
        if (teams == null || teams.size() < 2) {
            throw new IllegalArgumentException("At least two teams are required");
        }
        if (teams.stream().anyMatch(java.util.Objects::isNull)) {
            throw new IllegalArgumentException("Teams must not contain null");
        }
        if (new HashSet<>(teams).size() != teams.size()) {
            throw new IllegalArgumentException("Teams must be unique");
        }
    }

    private List<Team> prepareRotationTeams(List<Team> teams) {
        List<Team> rotation = new ArrayList<>(teams);
        if (rotation.size() % 2 != 0) {
            rotation.add(null);
        }
        return rotation;
    }

    private void offsetRotationTeams(List<Team> rotation) {
        Team last = rotation.removeLast();
        rotation.add(1, last);
    }
}
