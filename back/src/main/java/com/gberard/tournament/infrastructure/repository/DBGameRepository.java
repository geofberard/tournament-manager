package com.gberard.tournament.infrastructure.repository;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.port.output.GameRepository;
import com.gberard.tournament.infrastructure.repository.model.GameEntity;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Primary
@Repository
public class DBGameRepository implements GameRepository {

    private final JpaGameRepository repository;

    public DBGameRepository(JpaGameRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Game> readAll() {
        return repository.findAll().stream().map(GameEntity::toGame).toList();
    }

    @Override
    public boolean update(Game player) {
        repository.save(GameEntity.fromGame(player));
        return true;
    }

    @Override
    public boolean delete(Game player) {
        repository.delete(GameEntity.fromGame(player));
        return true;
    }

    @Override
    public boolean deleteAll() {
        repository.deleteAll();
        return true;
    }

    @Override
    public Optional<Game> search(String id) {
        return repository.findById(id).map(GameEntity::toGame);
    }

}
