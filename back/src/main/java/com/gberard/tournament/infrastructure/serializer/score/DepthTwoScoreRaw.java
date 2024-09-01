package com.gberard.tournament.infrastructure.serializer.score;

import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.infrastructure.serializer.ListRaw;
import com.gberard.tournament.domain.model.score.SetScore;

import java.util.List;

public final class DepthTwoScoreRaw {

    public static SetScore deserialize(String value, List<Team> contestantIds) {
        return new SetScore(ListRaw.deserialize(value).stream()
                .map(depthOne -> DepthOneScoreRaw.deserialize(depthOne, contestantIds))
                .toList());
    }

    public static String serialize(SetScore score, List<Team> contestantIds) {
        return ListRaw.serialize(
                score.result().stream()
                        .map(depthOne -> {
                            System.out.println(depthOne);
                            return DepthOneScoreRaw.serialize(depthOne, contestantIds);
                        }).toList());
    }

}
