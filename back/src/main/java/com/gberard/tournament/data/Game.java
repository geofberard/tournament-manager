package com.gberard.tournament.data;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static com.gberard.tournament.data.GameTeamStatus.*;

public record Game(
        String id,
        LocalDateTime time,
        String court,
        List<Contestant> contestants,
        Optional<Contestant> referee,
        Boolean isFinished,
        ScoreType scoreType,
        Optional<Score> score
) implements Identified{

}