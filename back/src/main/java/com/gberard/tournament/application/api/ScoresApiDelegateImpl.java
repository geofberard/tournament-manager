package com.gberard.tournament.application.api;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.gberard.tournament.application.mapper.GameScoreMapper;
import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.GameBuilder;
import com.gberard.tournament.domain.port.input.GameService;
import com.gberard.tournament.domain.port.input.TeamService;
import com.gberard.tournament.generated.api.ScoresApiDelegate;
import com.gberard.tournament.generated.model.GameScore;
import com.gberard.tournament.generated.model.UpsertGameScoreRequest;

import jakarta.persistence.EntityNotFoundException;

@Service
public class ScoresApiDelegateImpl implements ScoresApiDelegate {

    @Autowired
    public GameService gameService;

    @Autowired
    public TeamService teamService;

    @Override
    public ResponseEntity<Void> deleteGameScore(String gameId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public ResponseEntity<GameScore> getGameScore(String gameId) {
        throw new UnsupportedOperationException("Not implemented yet");
    }

    @Override
    public ResponseEntity<GameScore> upsertGameScore(String gameId, UpsertGameScoreRequest upsertGameScoreRequest) {
        Game matchingGame = findGameOrThrow(gameId);

        Game updatedGame = gameService.update(GameBuilder.from(matchingGame)
                .score(GameScoreMapper.toDomain(upsertGameScoreRequest, matchingGame.contestants()))
                .build());

        return ResponseEntity.ok(GameScoreMapper.toApi(updatedGame.score().get(), matchingGame.contestants()));
    }

    private com.gberard.tournament.domain.model.Game findGameOrThrow(String id) {
        return gameService.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Unknown game " + id));
    }
}