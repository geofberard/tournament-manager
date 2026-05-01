package com.gberard.tournament.application.mapper;

public final class PhaseMapper {

    private PhaseMapper() {
    }

    public static com.gberard.tournament.generated.model.Phase toApi(com.gberard.tournament.domain.model.Phase phase) {
        return new com.gberard.tournament.generated.model.Phase()
                .id(phase.id())
                .name(phase.name())
                .order(phase.order());
    }
}
