package com.gberard.tournament.data;

import java.util.Arrays;
import java.util.List;

import static com.gberard.tournament.data.DataUtils.LIST_SEPARATOR;
import static java.util.stream.Collectors.joining;

public final class DepthTwoScoreRaw {

    public static DepthTwoScore deserialize(String value, List<String> contestantIds) {
        return new DepthTwoScore(Arrays.stream(value.split(LIST_SEPARATOR))
                .map(depthOne -> DepthOneScoreRaw.deserialize(depthOne, contestantIds))
                .toList());
    }

    public static String serialize(DepthTwoScore score, List<String> contestantIds) {
        return score.result().stream()
                .map(depthOne -> {
                    System.out.println(depthOne);
                    return DepthOneScoreRaw.serialize(depthOne, contestantIds);
                })
                .collect(joining(LIST_SEPARATOR));
    }

}