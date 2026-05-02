package com.gberard.tournament.application.mapper;

import com.gberard.tournament.generated.model.CreatePhaseRequest;
import com.gberard.tournament.generated.model.UpdatePhaseRequest;

public final class PhaseMapper {

    private PhaseMapper() {
    }

    public static com.gberard.tournament.generated.model.Phase toApi(com.gberard.tournament.domain.model.Phase phase) {
        return new com.gberard.tournament.generated.model.Phase()
                .id(phase.id())
                .name(phase.name())
                .order(phase.order())
                .type(com.gberard.tournament.generated.model.PhaseType.fromValue(phase.type().name()));
    }

    public static com.gberard.tournament.domain.model.Phase toDomain(CreatePhaseRequest request) {
        return new com.gberard.tournament.domain.model.Phase(
                null,
                request.getName(),
                request.getOrder(),
                com.gberard.tournament.domain.model.PhaseType.valueOf(request.getType().getValue()));
    }

    public static com.gberard.tournament.domain.model.Phase toDomain(String id, UpdatePhaseRequest request) {
        return new com.gberard.tournament.domain.model.Phase(
                id,
                request.getName(),
                request.getOrder(),
                com.gberard.tournament.domain.model.PhaseType.valueOf(request.getType().getValue()));
    }
}
