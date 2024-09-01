package com.gberard.tournament.application.dto.score;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import com.gberard.tournament.domain.model.score.SimpleScore;
import com.gberard.tournament.domain.model.score.SetScore;
import com.gberard.tournament.domain.model.score.Score;
import com.gberard.tournament.domain.model.score.ScoreType;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type")
@JsonSubTypes({
        @JsonSubTypes.Type(value = SimpleScoreDTO.class, name = "Simple"),
        @JsonSubTypes.Type(value = SetScoreDTO.class, name = "Set")
})
public interface ScoreDTO {

    static ScoreDTO toDTO(Score score, ScoreType scoreType) {
        try {
            return switch (scoreType) {
                case Simple -> SimpleScoreDTO.toDTO((SimpleScore) score);
                case Set -> SetScoreDTO.toDTO((SetScore) score);
            };
        } catch (ClassCastException exception) {
            throw new IllegalArgumentException("DTO Type (" + score.getClass().getSimpleName()
                    + ") is not compatible with game type (" + scoreType + ")");
        }
    }

    static Score toDomain(ScoreDTO score, ScoreType scoreType) {
        try {
            return switch (scoreType) {
                case Simple -> SimpleScoreDTO.toDomain((SimpleScoreDTO) score);
                case Set -> SetScoreDTO.toDomain((SetScoreDTO) score);
            };
        } catch (ClassCastException exception) {
            throw new IllegalArgumentException("Type (" + score.getClass().getSimpleName()
                    + ") is not compatible with game type (" + scoreType + ")");
        }
    }

}
