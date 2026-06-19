package com.gberard.tournament.domain.model.scheduling;

import com.gberard.tournament.domain.model.Team;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

public record PlannedGame(
        TeamPair teamPair,
        LocalDateTime time,
        Optional<Team> referee
) {

    public PlannedGame {
        Objects.requireNonNull(teamPair, "teamPair must not be null");
        Objects.requireNonNull(referee, "referee must not be null");
        if (referee.filter(teamPair::contains).isPresent()) {
            throw new IllegalArgumentException("A contestant cannot referee its own game");
        }
    }

    public PlannedGame withReferee(Team assignedReferee) {
        return new PlannedGame(teamPair, time, Optional.of(assignedReferee));
    }
}
