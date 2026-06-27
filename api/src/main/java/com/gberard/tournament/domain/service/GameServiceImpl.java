package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.Phase;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.port.input.GameService;
import com.gberard.tournament.domain.port.output.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
public class GameServiceImpl implements GameService {

    @Autowired
    public GameRepository gameRepository;

    @Override
    public Game create(Game game) {
        return gameRepository.save(game);
    }

    @Override
    public Game update(Game game) {
        return gameRepository.save(validatePosition(game));
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
    public List<Game> findByPhase(Phase phase) {
        return gameRepository.findByPhaseId(phase.id());
    }

    @Override
    public List<Game> findAll() {
        return gameRepository.findAll().stream()
                .sorted(Comparator.comparing(Game::position, Comparator.nullsLast(Long::compareTo)))
                .toList();
    }

    private Game validatePosition(Game game) {
        if (game.position() <= 0) {
            throw new IllegalArgumentException("position must be positive");
        }

        return game;
    }
}
