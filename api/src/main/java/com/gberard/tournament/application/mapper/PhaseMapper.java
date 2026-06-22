package com.gberard.tournament.application.mapper;

import com.gberard.tournament.generated.model.CreatePhaseRequest;
import com.gberard.tournament.generated.model.UpdatePhaseRequest;

public final class PhaseMapper {

    private PhaseMapper() {
    }

    public static com.gberard.tournament.generated.model.Phase toApi(com.gberard.tournament.domain.model.Phase phase) {
        return new com.gberard.tournament.generated.model.Phase()
                .id(phase.id())
                .parentId(phase.parentId().orElse(null))
                .name(phase.name())
                .details(phase.details())
                .order(phase.order())
                .type(phase.type()
                        .map(type -> com.gberard.tournament.generated.model.PhaseType.fromValue(type.name()))
                        .orElse(null));
    }

    public static com.gberard.tournament.domain.model.Phase toDomain(CreatePhaseRequest request) {
        return new com.gberard.tournament.domain.model.Phase(
                null,
                java.util.Optional.ofNullable(request.getParentId()),
                request.getName(),
                request.getDetails(),
                request.getOrder(),
                java.util.Optional.ofNullable(request.getType())
                        .map(type -> com.gberard.tournament.domain.model.PhaseType.valueOf(type.getValue())));
    }

    public static com.gberard.tournament.domain.model.Phase toDomain(String id, UpdatePhaseRequest request) {
        return new com.gberard.tournament.domain.model.Phase(
                id,
                java.util.Optional.ofNullable(request.getParentId()),
                request.getName(),
                request.getDetails(),
                request.getOrder(),
                java.util.Optional.ofNullable(request.getType())
                        .map(type -> com.gberard.tournament.domain.model.PhaseType.valueOf(type.getValue())));
    }
}
