package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.Player;
import com.gberard.tournament.domain.port.input.PlayerService;
import com.gberard.tournament.domain.port.output.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PlayerServiceImpl implements PlayerService {

    @Autowired
    public PlayerRepository repository;

    @Override
    public Optional<Player> findById(String id) {
        return repository.read(id);
    }

    @Override
    public List<Player> findAll() {
        return repository.readAll();
    }

    @Override
    public Player create(String firstName, String lastName) {
        return repository.create(new Player(null, firstName, lastName));
    }

    @Override
    public Player update(String id, String firstName, String lastName) {
        Player player = repository.readOrThrow(id);
        return repository.create(new Player(player.id(), firstName, lastName));
    }

    @Override
    public boolean delete(String id) {
        Optional<Player> box = findById(id);
        box.ifPresent(repository::delete);
        return box.isPresent();
    }

}
