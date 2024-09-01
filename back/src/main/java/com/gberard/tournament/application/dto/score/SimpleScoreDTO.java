package com.gberard.tournament.application.dto.score;

import com.gberard.tournament.domain.model.score.SimpleScore;

import java.util.Map;

public record SimpleScoreDTO(Map<String, Integer> result) implements ScoreDTO {

    public static SimpleScoreDTO toDTO(SimpleScore score) {
        return new SimpleScoreDTO(score.result());
    }

    public static SimpleScore toDomain(SimpleScoreDTO dto) {
        return new SimpleScore(dto.result());
    }
}