package com.gberard.tournament.adapter.serializer.score;

import com.gberard.tournament.adapter.serializer.ListRaw;
import com.gberard.tournament.domain.score.DepthTwoScore;

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