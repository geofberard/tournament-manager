package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.port.input.GameService;
import com.gberard.tournament.domain.port.input.TeamService;
import com.gberard.tournament.domain.port.output.GameRepository;
import com.gberard.tournament.domain.port.output.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GameServiceImpl implements GameService {

    @Autowired
    public GameRepository gameRepository;

    @Override
    public Game create(Game player) {
        return gameRepository.create(player);
    }

    @Override
    public Game update(Game player) {
        return gameRepository.update(player);
    }

    @Override
    public boolean delete(Game player) {
        return gameRepository.delete(player);
    }

    @Override
    public Optional<Game> findById(String id) {
        return gameRepository.search(id);
    }

    @Override
    public List<Game> findAll() {
        return gameRepository.readAll();
    }
}
