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
    public PlayerRepository playerRepository;

    @Override
    public Player create(Player player) {
        playerRepository.create(player);
        return new Player("","","");
    }

    @Override
    public Player update(Player player) {
        playerRepository.update(player);
        return new Player("","","");
    }

    @Override
    public boolean delete(Player player) {
        return playerRepository.delete(player);
    }

    @Override
    public Optional<Player> findById(String id) {
        return playerRepository.search(id);
    }

    @Override
    public List<Player> findAll() {
        return playerRepository.readAll();
    }
}
