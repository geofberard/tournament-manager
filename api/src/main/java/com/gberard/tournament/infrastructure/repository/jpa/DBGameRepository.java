package com.gberard.tournament.infrastructure.repository.jpa;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.port.output.GameRepository;
import com.gberard.tournament.infrastructure.repository.jpa.model.GameEntity;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

@Primary
@Repository
public class DBGameRepository extends DBRepository<Game, GameEntity> implements GameRepository {

    private final JpaGameRepository repository;

    public DBGameRepository(JpaGameRepository repository) {
        super(repository, GameEntity::toEntity, GameEntity::toDomain);
        this.repository = repository;
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
    public java.util.List<Game> findByTeamId(String teamId) {
        return repository.findByTeamsId(teamId).stream()
                .map(GameEntity::toDomain)
                .toList();
    }

    @Override
    public java.util.List<Game> findByPool(String pool) {
        return repository.findByPool(pool).stream()
                .map(GameEntity::toDomain)
                .toList();
    }

    @Override
    public Game save(Game game) {
        return saveMapped(game);
    }

    @Override
    public void deleteById(String id) {
        deleteByIdMapped(id);
    }

}
