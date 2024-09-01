package com.gberard.tournament.infrastructure.serializer.score;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.score.SimpleScore;
import com.gberard.tournament.domain.model.score.SetScore;
import com.gberard.tournament.domain.model.score.Score;
import com.gberard.tournament.domain.model.score.ScoreType;

import java.util.List;
import java.util.function.Function;

public final class ScoreRaw {

    public static Function<String, Score> getScoreDeserializer(List<Team> contestants, ScoreType type) {
        return switch (type) {
            case Simple -> score -> score != null ? DepthOneScoreRaw.deserialize(score, contestants) : null;
            case Set -> score -> score != null ? DepthTwoScoreRaw.deserialize(score, contestants) : null;
            default -> throw new IllegalStateException("Unsuported score type : " + type);
        };
    }

    public static Function<Score, String> getScoreSerializer(Game game) {
        return switch (game.scoreType()) {
            case Simple -> score -> DepthOneScoreRaw.serialize((SimpleScore) score, game.contestants());
            case Set -> score -> DepthTwoScoreRaw.serialize((SetScore) score, game.contestants());
            default -> throw new IllegalStateException("Unsuported score type : " + game.scoreType());
        };
    }

}
