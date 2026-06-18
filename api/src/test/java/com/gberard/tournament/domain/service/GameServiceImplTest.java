package com.gberard.tournament.domain.service;

import static com.gberard.tournament.TestUtils.gameBuilder;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.port.output.GameRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class GameServiceImplTest {

    @InjectMocks
    private GameServiceImpl gameService;

    @Mock
    private GameRepository gameRepository;

    @Test
    void shouldDelegatePositionGenerationToRepositoryWhenCreatingGame() {
        // GIVEN
        Game game = gameBuilder().position(null).build();
        Game savedGame = gameBuilder().position(1L).build();
        when(gameRepository.save(any(Game.class))).thenReturn(savedGame);

        // WHEN
        Game createdGame = gameService.create(game);

        // THEN
        ArgumentCaptor<Game> gameCaptor = ArgumentCaptor.forClass(Game.class);
        org.mockito.Mockito.verify(gameRepository).save(gameCaptor.capture());
        assertThat(gameCaptor.getValue().position()).isNull();
        assertThat(createdGame.position()).isEqualTo(1L);
    }
}
