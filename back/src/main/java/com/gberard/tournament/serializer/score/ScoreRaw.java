package com.gberard.tournament.serializer.score;

import com.gberard.tournament.data.client.Game;
import com.gberard.tournament.data.score.DepthOneScore;
import com.gberard.tournament.data.score.DepthTwoScore;
import com.gberard.tournament.data.score.Score;
import com.gberard.tournament.data.score.ScoreType;

import java.util.List;
import java.util.function.Function;

public final class ScoreRaw {

    public static Function<String, Score> getScoreDeserializer(List<String> contestentIds, ScoreType type) {
        return switch (type) {
            case DepthOne -> score -> DepthOneScoreRaw.deserialize(score, contestentIds);
            case DepthTwo -> score -> DepthTwoScoreRaw.deserialize(score, contestentIds);
            default -> throw new IllegalStateException("Unsuported score type : " + type);
        };
    }

    public static Function<Score, String> getScoreSerializer(Game game) {
        return switch (game.scoreType()) {
            case DepthOne -> score -> DepthOneScoreRaw.serialize((DepthOneScore) score, game.contestantIds());
            case DepthTwo -> score -> DepthTwoScoreRaw.serialize((DepthTwoScore) score, game.contestantIds());
            default -> throw new IllegalStateException("Unsuported score type : " + game.scoreType());
        };
    }

}