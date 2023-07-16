package com.gberard.tournament.data;

import java.util.Arrays;
import java.util.List;

import static com.gberard.tournament.data.DataUtils.SCORE_SEPARATOR;
import static java.util.stream.Collectors.joining;
import static java.util.stream.Collectors.toMap;
import static java.util.stream.IntStream.range;

public final class DepthOneScoreRaw {

    public static DepthOneScore deserialize(String value, List<String> contestantIds) {
        List<Integer> points = Arrays.stream(value.split(SCORE_SEPARATOR)).map(Integer::parseInt).toList();

        return new DepthOneScore(range(0, contestantIds.size())
                .boxed()
                .collect(toMap(contestantIds::get, points::get)));
    }

    public static String serialize(DepthOneScore score, List<String> contestantIds) {
        return contestantIds.stream()
                .map(score.result()::get)
                .map(Object::toString)
                .collect(joining(SCORE_SEPARATOR));
    }

}