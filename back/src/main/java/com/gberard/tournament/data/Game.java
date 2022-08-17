package com.gberard.tournament.data;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.OptionalInt;

public record Game(
        String id,
        LocalDateTime time,
        String court,
        Team teamA,
        Team teamB,
        Optional<Team> referee,
        OptionalInt scoreA,
        OptionalInt scoreB
) {
}