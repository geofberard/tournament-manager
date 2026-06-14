package com.gberard.tournament.domain.model.scheduling;

import com.gberard.tournament.domain.model.Team;

import java.util.List;
import java.util.Objects;

public record TeamPair(Team first, Team second) {

    public TeamPair {
        Objects.requireNonNull(first, "first team must not be null");
        Objects.requireNonNull(second, "second team must not be null");
        if (first.equals(second)) {
            throw new IllegalArgumentException("A team cannot play against itself");
        }
    }

    public List<Team> teams() {
        return List.of(first, second);
    }

    public boolean contains(Team team) {
        return first.equals(team) || second.equals(team);
    }
}
