package com.gberard.tournament.infrastructure.serializer.score;

import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.score.SimpleScore;

import java.util.Arrays;
import java.util.List;

import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toMap;
import static java.util.stream.IntStream.range;

public final class DepthOneScoreRaw {

    public static final String SCORE_SEPARATOR = "-";

    public static SimpleScore deserialize(String value, List<Team> contestants) {
        List<Integer> points = Arrays.stream(value.split(SCORE_SEPARATOR)).map(Integer::parseInt).toList();

        return new SimpleScore(range(0, contestants.size())
                .boxed()
                .collect(toMap(index -> contestants.get(index).id(), points::get)));
    }

    public static String serialize(SimpleScore score, List<Team> contestants) {
        return contestants.stream()
                .map(Team::id)
                .map(score.result()::get)
                .map(Object::toString)
                .collect(joining(SCORE_SEPARATOR));
    }

}
