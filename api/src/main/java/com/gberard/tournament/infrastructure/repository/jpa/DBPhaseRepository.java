package com.gberard.tournament.infrastructure.repository.jpa;

import com.gberard.tournament.domain.model.Phase;
import com.gberard.tournament.domain.port.output.PhaseRepository;
import com.gberard.tournament.infrastructure.repository.jpa.model.PhaseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DBPhaseRepository extends DBRepository<Phase, PhaseEntity> implements PhaseRepository {

    private final JpaPhaseRepository repository;

    public DBPhaseRepository(JpaPhaseRepository repository) {
        super(repository, PhaseEntity::toEntity, PhaseEntity::toDomain);
        this.repository = repository;
    }

    @Override
    public List<Phase> findAll() {
        return repository.findAllByOrderByDisplayOrderAsc().stream()
                .map(PhaseEntity::toDomain)
                .toList();
    }

    @Override
    public Optional<Phase> findById(String id) {
        return findByIdMapped(id);
    }
}
