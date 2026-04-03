package com.gberard.tournament.domain.model;

import com.gberard.tournament.domain.model.score.SimpleScore;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public record Game(
        String id,
        LocalDateTime time,
        String court,
        List<Team> contestants,
        Optional<Team> refereeId,
        Boolean isFinished,
        Optional<SimpleScore> score
) implements Identified {
}
