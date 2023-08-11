package com.gberard.tournament.serializer.score;

import com.gberard.tournament.data.score.DepthTwoScore;
import com.gberard.tournament.serializer.ListRaw;

import java.util.List;

public final class DepthTwoScoreRaw {

    public static DepthTwoScore deserialize(String value, List<String> contestantIds) {
        return new DepthTwoScore(ListRaw.deserialize(value).stream()
                .map(depthOne -> DepthOneScoreRaw.deserialize(depthOne, contestantIds))
                .toList());
    }

    public static String serialize(DepthTwoScore score, List<String> contestantIds) {
        return ListRaw.serialize(
                score.result().stream()
                        .map(depthOne -> {
                            System.out.println(depthOne);
                            return DepthOneScoreRaw.serialize(depthOne, contestantIds);
                        }).toList());
    }

}