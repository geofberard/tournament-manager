package com.gberard.tournament.application.dto;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.score.Score;
import com.gberard.tournament.domain.model.score.ScoreType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public record UpdateGameDTO(
        String id,
        LocalDateTime time,
        String court,
        List<String> contestants,
        Optional<String> referee,
        Boolean isFinished,
        ScoreType scoreType,
        Optional<Score> score
) {
}


