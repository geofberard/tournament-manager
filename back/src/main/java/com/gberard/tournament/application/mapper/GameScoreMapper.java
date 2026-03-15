package com.gberard.tournament.application.mapper;

import java.util.List;

import com.gberard.tournament.generated.model.GameScore;
import com.gberard.tournament.generated.model.UpsertGameScoreRequest;

public final class GameScoreMapper {

    public static com.gberard.tournament.generated.model.GameScore toApi(
            com.gberard.tournament.domain.model.score.Score gameScore,
            List<com.gberard.tournament.domain.model.Team> contestants
    ) {
        GameScore gameScoreDTO = new GameScore();
        contestants.forEach(team -> gameScoreDTO.putPointsByTeamItem(team.id(), gameScore.getPointFor(team)));

        return gameScoreDTO;
    }

    public static com.gberard.tournament.domain.model.score.SimpleScore toDomain(
            UpsertGameScoreRequest request,
            List<com.gberard.tournament.domain.model.Team> contestants
    ) {
        return new com.gberard.tournament.domain.model.score.SimpleScore(request.getPointsByTeam());
    }

}
