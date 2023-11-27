package com.gberard.tournament.application.response;

import com.gberard.tournament.domain.model.score.Score;
import com.gberard.tournament.domain.model.score.ScoreType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public record GameDTO(
        String id,
        LocalDateTime time,
        String court,
        List<String> contestantIds,
        Optional<String> refereeId,
        Boolean isFinished,
        ScoreType scoreType,
        Optional<Score> score
) {
}


