package com.gberard.tournament.application.dto.score;

import com.gberard.tournament.domain.model.score.SetScore;
import com.gberard.tournament.domain.model.score.SimpleScore;

import java.util.List;
import java.util.Map;

public record SetScoreDTO(List<Map<String, Integer>> result) implements ScoreDTO {

    public static SetScoreDTO toDTO(SetScore score) {
        var results = score.result().stream()
                .map(SimpleScore::result)
                .toList();
        return new SetScoreDTO(results);
    }

    public static SetScore toDomain(SetScoreDTO dto) {
        List<SimpleScore> results = dto.result().stream()
                .map(SimpleScore::new)
                .toList();
        return new SetScore(results);
    }
}
