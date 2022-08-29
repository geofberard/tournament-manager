package com.gberard.tournament.service;

import com.gberard.tournament.data.Game;
import com.gberard.tournament.data.Team;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static com.gberard.tournament.data._TestUtils.*;
import static java.time.Month.AUGUST;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class GameServiceMapperTest {

    @Spy
    @InjectMocks
    private GameService gameService;

    @Mock
    private TeamService teamService;

    private void mockTeamService(Team... teams) {
        if (teams.length == 0) {
            when(teamService.search(any())).thenReturn(Optional.of(teamA));
        } else {
            Arrays.stream(teams)
                    .forEach(team -> when(teamService.search(eq(team.id()))).thenReturn(Optional.of(team)));
        }
    }

    @Nested
    @DisplayName("fromRawData()")
    class FromRawData {

        @Test
        void should_use_teamService() {
            // Given
            List<Object> rawGame =
                    rawData("game1", "23/08/2022", "10:00", "Court1", "teamA", "teamB", "teamC", "25", "16");
            mockTeamService(teamA, teamB, teamC);

            // When
            Game game = gameService.fromRawData(rawGame);

            // Then
            verify(teamService, times(1)).search(eq(teamA.id()));
            verify(teamService, times(1)).search(eq(teamB.id()));
            verify(teamService, times(1)).search(eq(teamC.id()));
        }

        @Test
        void should_map_game_completed() {
            // Given
            List<Object> rawGame =
                    rawData("game1", "23/08/2022", "10:00", "Court1", "teamA", "teamB", "teamC", "25", "16");
            mockTeamService(teamA, teamB, teamC);

            // When
            Game game = gameService.fromRawData(rawGame);

            // Then
            assertThat(game.id()).isEqualTo("game1");
            assertThat(game.time()).isEqualTo(LocalDateTime.of(2022, 8, 23, 10, 0));
            assertThat(game.court()).isEqualTo("Court1");
            assertThat(game.teamA()).isEqualTo(teamA);
            assertThat(game.teamB()).isEqualTo(teamB);
            assertThat(game.referee()).isNotEmpty().hasValue(teamC);
            assertThat(game.scoreA()).isNotEmpty().hasValue(25);
            assertThat(game.scoreB()).isNotEmpty().hasValue(16);
        }

        @Test
        void should_map_game_scoreless() {
            // Given
            List<Object> rawGame = rawData("game2", "23/08/2022", "11:00", "Court1", "teamA", "teamB", "teamC");
            mockTeamService(teamA, teamB);

            // When
            Game game = gameService.fromRawData(rawGame);

            // Then
            assertThat(game.scoreA()).isEmpty();
            assertThat(game.scoreB()).isEmpty();
        }

        @Test
        void should_map_game_score_empty() {
            // Given
            List<Object> rawGame = rawData("game4", "23/08/2022", "13:00", "Court1", "teamA", "teamC", "", "", "");
            mockTeamService(teamA, teamC);

            // When
            Game game = gameService.fromRawData(rawGame);

            // Then
            assertThat(game.scoreA()).isEmpty();
            assertThat(game.scoreB()).isEmpty();
        }

        @Test
        void should_map_game_referee_empty() {
            // Given
            List<Object> rawGame = rawData("game5", "23/08/2022", "14:00", "Court1", "teamA", "teamB", "");
            mockTeamService(teamA, teamB);

            // When
            Game game = gameService.fromRawData(rawGame);

            // Then
            assertThat(game.referee()).isEmpty();
        }

    }

    @Nested
    @DisplayName("toRawData()")
    class ToRawData {

        @Test
        void should_handle_full_game() {
            // Given
            List<Object> rawData = gameService.toRawData(game1);

            // Then
            assertThat(rawData).containsExactly("game1", "29/08/2022", "10:30", game1.court(), teamA.id(), teamB.id(),
                    teamC.id(), "25", "14");
        }

        @Test
        void should_handle_partiel_game() {
            // Given
            String court = "court";
            Game game = Game.builder()
                    .id("gameId")
                    .time(LocalDateTime.of(2022, AUGUST, 29, 10, 30))
                    .court(court)
                    .teamA(teamA)
                    .teamB(teamB)
                    .build();

            // Given
            List<Object> rawData = gameService.toRawData(game);

            // Then
            assertThat(rawData)
                    .containsExactly("gameId", "29/08/2022", "10:30", court, teamA.id(), teamB.id(), "", "", "");
        }

    }

}