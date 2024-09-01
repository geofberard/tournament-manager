package com.gberard.tournament.domain.model;

import com.gberard.tournament.domain.model.score.Score;
import com.gberard.tournament.domain.model.score.ScoreType;
import lombok.Builder;

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
        ScoreType scoreType,
        Optional<Score> score
) implements Identified {
}
