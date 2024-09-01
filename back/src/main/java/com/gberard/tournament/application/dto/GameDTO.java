package com.gberard.tournament.application.dto;

import com.gberard.tournament.application.dto.score.ScoreDTO;
import com.gberard.tournament.application.dto.score.SetScoreDTO;
import com.gberard.tournament.application.dto.score.SimpleScoreDTO;
import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.score.SimpleScore;
import com.gberard.tournament.domain.model.score.SetScore;
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
        Optional<ScoreDTO> score
) {

    public static GameDTO toGameDTO(Game game) {
        ScoreDTO scoreDTO = null;

        if (game.score().isPresent()) {
            Score score = game.score().get();
            switch (game.scoreType()){
                case Simple -> scoreDTO = SimpleScoreDTO.toDTO((SimpleScore) score);
                case Set -> scoreDTO = SetScoreDTO.toDTO((SetScore) score);
            }
        }

        return new GameDTO(
                game.id(),
                game.time(),
                game.court(),
                game.contestants().stream().map(TeamDTO::toTeamDTO).toList(),
                game.refereeId().map(TeamDTO::toTeamDTO),
                game.isFinished(),
                game.scoreType(),
                Optional.ofNullable(scoreDTO)
        );
    }
}


