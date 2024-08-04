package com.gberard.tournament.infrastructure.repository.jpa;

import com.gberard.tournament.domain.model.Player;
import com.gberard.tournament.domain.port.output.PlayerRepository;
import com.gberard.tournament.infrastructure.repository.jpa.model.PlayerEntity;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Primary
@Repository
public class DBPlayerRepository implements PlayerRepository {

    private final JpaPlayerRepository repository;

    public DBPlayerRepository(JpaPlayerRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Player> readAll() {
        return repository.findAll().stream().map(PlayerEntity::toPlayer).toList();
    }

    @Override
    public Player create(Player player) {
        return repository.save(PlayerEntity.fromPlayer(player)).toPlayer();
    }

    @Override
    public Player update(Player player) {
        return repository.save(PlayerEntity.fromPlayer(player)).toPlayer();
    }

    @Override
    public boolean delete(Player player) {
        repository.delete(PlayerEntity.fromPlayer(player));
        return true;
    }

    @Override
    public boolean deleteAll() {
        repository.deleteAll();
        return true;
    }

    @Override
    public Optional<Player> search(String id) {
        return repository.findById(id).map(PlayerEntity::toPlayer);
    }

}
