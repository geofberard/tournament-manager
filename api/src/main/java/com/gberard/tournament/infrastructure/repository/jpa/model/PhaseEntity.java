package com.gberard.tournament.infrastructure.repository.jpa.model;

import com.gberard.tournament.domain.model.Phase;
import com.gberard.tournament.domain.model.PhaseType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity(name = "phase")
@Table(name = "phases")
public class PhaseEntity {

    @Id
    String id;

    String name;

    Integer displayOrder;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    PhaseType type;

    @PrePersist
    public void generateUUID() {
        if (this.id == null) {
            this.id = "phase_" + UUID.randomUUID();
        }
    }

    public static Phase toDomain(PhaseEntity phaseEntity) {
        return new Phase(phaseEntity.id, phaseEntity.name, phaseEntity.displayOrder, phaseEntity.type);
    }

    public static PhaseEntity toEntity(Phase phase) {
        PhaseEntity phaseEntity = new PhaseEntity();
        phaseEntity.id = phase.id();
        phaseEntity.name = phase.name();
        phaseEntity.displayOrder = phase.order();
        phaseEntity.type = phase.type();
        return phaseEntity;
    }
}
