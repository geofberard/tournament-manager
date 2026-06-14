package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.scheduling.PlannedGame;
import com.gberard.tournament.domain.model.scheduling.TeamPair;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;

@Component
public class SingleCourtTimeScheduler {

    public List<PlannedGame> schedule(
            List<TeamPair> teamPairs,
            LocalDateTime startTime,
            Duration gameDuration,
            Duration breakDuration
    ) {
        validateParameters(teamPairs, startTime, gameDuration, breakDuration);

        Duration slotDuration = gameDuration.plus(breakDuration);
        return IntStream.range(0, teamPairs.size())
                .mapToObj(index -> new PlannedGame(
                        teamPairs.get(index),
                        startTime.plus(slotDuration.multipliedBy(index)),
                        Optional.empty()
                ))
                .toList();
    }

    private void validateParameters(
            List<TeamPair> teamPairs,
            LocalDateTime startTime,
            Duration gameDuration,
            Duration breakDuration
    ) {
        if (teamPairs == null) {
            throw new IllegalArgumentException("teamPairs must not be null");
        }
        if (startTime == null) {
            throw new IllegalArgumentException("startTime must not be null");
        }
        if (gameDuration == null || gameDuration.isZero() || gameDuration.isNegative()) {
            throw new IllegalArgumentException("gameDuration must be positive");
        }
        if (breakDuration == null || breakDuration.isNegative()) {
            throw new IllegalArgumentException("breakDuration must not be negative");
        }
    }
}
