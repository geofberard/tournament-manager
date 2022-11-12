package com.gberard.tournament.data.score;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gberard.tournament.data.score.onelevel.OneLevelScore;
import com.gberard.tournament.data.score.twolevel.TwoLevelScore;
import com.google.common.annotations.VisibleForTesting;
import lombok.extern.slf4j.Slf4j;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Slf4j
public abstract class ScoreUtils {

    private static final Set<Class<? extends Score>> supportedScore =
            new HashSet<>(Arrays.asList(OneLevelScore.class, TwoLevelScore.class));

    private static ObjectMapper mapper = new ObjectMapper();

    @VisibleForTesting
    public static void addSupportedScore(Class<? extends Score> scoreClass) {
        supportedScore.add(scoreClass);
    }

    public static String getScoreType(Score score) {
        return score.getClass().getSimpleName();
    }

    private static Optional<Class<? extends Score>> getScoreClass(String scoreType) {
        return supportedScore.stream()
                .filter(clazz -> clazz.getSimpleName().equals(scoreType))
                .findFirst();
    }

    public static Optional<Score> scoreFromJson(String scoreJson, String scoreType) {
        try {
            var scoreClass = getScoreClass(scoreType);

            if (scoreClass.isPresent()) {
                return Optional.of(mapper.readValue(scoreJson, scoreClass.get()));
            }
            log.error("Unknown ScoreType : " + scoreType);

        } catch (JsonProcessingException exception) {
            log.error("Conversion error", exception);
        }
        return Optional.empty();
    }

    public static Optional<String> scoreToJson(Score score) {
        try {
            return Optional.of(mapper.writeValueAsString(score));
        } catch (JsonProcessingException e) {
            log.error("Unable to serialize : " + score);
        }
        return Optional.empty();
    }


}