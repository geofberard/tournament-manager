package com.gberard.tournament.domain.client;

import com.gberard.tournament.domain.score.Score;
import com.gberard.tournament.domain.score.ScoreType;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public record Game(
        String id,
        LocalDateTime time,
        String court,
        List<String> contestantIds,
        Optional<String> refereeId,
        Boolean isFinished,
        ScoreType scoreType,
        Optional<Score> score
) implements Identified {

    @Builder
    public static Game createGame(
            String id,
            LocalDateTime time,
            String court,
            List<String> contestantIds,
            String refereeId,
            Boolean isFinished,
            ScoreType scoreType,
            Score score
    ) {
        return new Game(id, time, court, contestantIds, Optional.ofNullable(refereeId), isFinished, scoreType,
                Optional.ofNullable(score));
    }
}