package com.gberard.tournament.application.response;

import com.gberard.tournament.domain.model.Game;

public class GameDTOMapper {
    public static GameDTO toGameDTO(Game game) {
        return new GameDTO(
                game.id(),
                game.time(),
                game.court(),
                game.contestants(),
                game.refereeId(),
                game.isFinished(),
                game.scoreType(),
                game.score()
        );
    }
}
