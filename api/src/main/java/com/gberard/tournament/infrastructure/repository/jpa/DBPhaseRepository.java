package com.gberard.tournament.infrastructure.repository.jpa;

import com.gberard.tournament.domain.model.Phase;
import com.gberard.tournament.domain.port.output.PhaseRepository;
import com.gberard.tournament.infrastructure.repository.jpa.model.PhaseEntity;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DBPhaseRepository extends DBRepository<Phase, PhaseEntity> implements PhaseRepository {

    public DBPhaseRepository(JpaPhaseRepository repository) {
        super(repository, PhaseEntity::toEntity, PhaseEntity::toDomain);
    }

    @Override
    public Optional<Phase> findById(String id) {
        return findByIdMapped(id);
    }
}
