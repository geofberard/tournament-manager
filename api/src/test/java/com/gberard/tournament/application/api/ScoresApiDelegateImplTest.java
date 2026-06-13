package com.gberard.tournament.application.api;

import static com.gberard.tournament.TestUtils.TEAM_A;
import static com.gberard.tournament.TestUtils.TEAM_B;
import static com.gberard.tournament.TestUtils.buildGame;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.port.input.GameService;

@ExtendWith(MockitoExtension.class)
class ScoresApiDelegateImplTest {

    @InjectMocks
    private ScoresApiDelegateImpl scoresApiDelegate;

    @Mock
    private GameService gameService;

    @Test
    void shouldDeleteAnExistingGameScore() {
        // GIVEN
        Game game = buildGame(TEAM_A, 12, TEAM_B, 9);
        when(gameService.findById(game.id())).thenReturn(Optional.of(game));
        when(gameService.update(any(Game.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        var response = scoresApiDelegate.deleteGameScore(game.id());

        // THEN
        var gameCaptor = ArgumentCaptor.forClass(Game.class);
        verify(gameService).update(gameCaptor.capture());
        assertThat(gameCaptor.getValue().score()).isEmpty();
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NO_CONTENT);
    }
}
