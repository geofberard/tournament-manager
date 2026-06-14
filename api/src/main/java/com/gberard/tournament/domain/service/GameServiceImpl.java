package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.port.input.GameService;
import com.gberard.tournament.domain.port.output.GameRepository;
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
        return gameRepository.save(player);
    }

    @Override
    public Game update(Game player) {
        return gameRepository.save(player);
    }

    @Override
    public boolean delete(Game player) {
        gameRepository.deleteById(player.id());
        return true;
    }

    @Override
    public Optional<Game> findById(String id) {
        return gameRepository.findById(id);
    }

    @Override
    public List<Game> findByTeam(Team searchedTeam) {
        return gameRepository.findByTeamId(searchedTeam.id());
    }

    @Override
    public List<Game> findAll() {
        return gameRepository.findAll();
    }

    @Override
    public List<Game> findByGroupAndPhase(String group, String phaseId) {
        return gameRepository.findByGroupAndPhaseId(group, phaseId);
    }
}
