package com.gberard.tournament.application.response;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.score.Score;
import com.gberard.tournament.domain.model.score.ScoreType;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public record GameDTO(
        String id,
        LocalDateTime time,
        String court,
        List<TeamDTO> contestantIds,
        Optional<TeamDTO> refereeId,
        Boolean isFinished,
        ScoreType scoreType,
        Optional<Score> score
) {

    public static GameDTO toGameDTO(Game game) {
        return new GameDTO(
                game.id(),
                game.time(),
                game.court(),
                game.contestants().stream().map(TeamDTO::toTeamDTO).toList(),
                game.refereeId().map(TeamDTO::toTeamDTO),
                game.isFinished(),
                game.scoreType(),
                game.score()
        );
    }
}


