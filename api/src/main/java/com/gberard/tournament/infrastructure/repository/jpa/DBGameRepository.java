package com.gberard.tournament.infrastructure.repository.jpa;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.port.output.GameRepository;
import com.gberard.tournament.infrastructure.repository.jpa.model.GameEntity;
import com.gberard.tournament.infrastructure.repository.jpa.model.PhaseEntity;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

@Primary
@Repository
public class DBGameRepository extends DBRepository<Game, GameEntity> implements GameRepository {

    private final JpaGameRepository repository;
    private final JpaPhaseRepository phaseRepository;

    public DBGameRepository(JpaGameRepository repository, JpaPhaseRepository phaseRepository) {
        super(repository, GameEntity::toEntity, GameEntity::toDomain);
        this.repository = repository;
        this.phaseRepository = phaseRepository;
    }

    @Override
    public java.util.List<Game> findAll() {
        return findAllMapped();
    }

    @Override
    public java.util.Optional<Game> findById(String id) {
        return findByIdMapped(id);
    }

    @Override
    public boolean existsByTeamId(String teamId) {
        return repository.existsByTeamsId(teamId);
    }

    @Override
    public boolean existsByPhaseId(String phaseId) {
        return repository.existsByPhaseId(phaseId);
    }

    @Override
    public java.util.List<Game> findByTeamId(String teamId) {
        return repository.findByTeamsId(teamId).stream()
                .map(GameEntity::toDomain)
                .toList();
    }

    @Override
    public java.util.List<Game> findByPhaseId(String phaseId) {
        return repository.findByPhaseId(phaseId).stream()
                .map(GameEntity::toDomain)
                .toList();
    }

    @Override
    public java.util.List<Game> findByTeamIdAndPhaseId(String teamId, String phaseId) {
        return repository.findByTeamsIdAndPhaseId(teamId, phaseId).stream()
                .map(GameEntity::toDomain)
                .toList();
    }

    @Override
    public Game save(Game game) {
        PhaseEntity phase = phaseRepository.findById(game.phase().id())
                .orElseThrow();
        return GameEntity.toDomain(repository.saveAndFlush(GameEntity.toEntity(game, phase)));
    }

    @Override
    public void deleteById(String id) {
        deleteByIdMapped(id);
    }

}
