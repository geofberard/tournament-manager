package com.gberard.tournament.service;

import com.gberard.tournament.config.SpreadsheetConfig;
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
import java.util.stream.Stream;

import static com.gberard.tournament.data._TestUtils.*;
import static java.time.Month.AUGUST;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class GameServiceTest {

    public static final List<Object> RAW_GAME_1 =
            rawData("game1", "23/08/2022", "10:00", "Court1", "teamA", "teamB", "teamC", "25", "16");
    public static final List<Object> RAW_GAME_2 =
            rawData("game2", "23/08/2022", "11:00", "Court1", "teamA", "teamB", "teamC");
    public static final List<Object> RAW_GAME_3 =
            rawData("game3", "23/08/2022", "12:00", "Court1", "teamA", "teamB");
    public static final List<Object> RAW_GAME_4 =
            rawData("game4", "23/08/2022", "13:00", "Court1", "teamA", "teamC", "", "", "");
    public static final List<Object> RAW_GAME_5 =
            rawData("game5", "23/08/2022", "14:00", "Court1", "teamA", "teamB", "");

    @Spy
    @InjectMocks
    private GameService gameService = new GameService();

    @Mock
    private SheetService sheetService;

    @Mock
    private TeamService teamService;

    @Mock
    private SpreadsheetConfig sheetConfig;

    private void mockTeamService(Team... teams) {
        if (teams.length == 0) {
            when(teamService.getTeam(any())).thenReturn(Optional.of(teamA));
        } else {
            Arrays.stream(teams).forEach(
                    team -> when(teamService.getTeam(eq(team.id()))).thenReturn(Optional.of(team))
            );
        }
    }

    @Nested
    @DisplayName("toGame()")
    class ToGame {

        @Test
        void should_use_teamService() {
            // Given
            mockTeamService(teamA, teamB, teamC);

            // When
            Game game = gameService.toGame(RAW_GAME_1);

            // Then
            verify(teamService, times(1)).getTeam(eq(teamA.id()));
            verify(teamService, times(1)).getTeam(eq(teamB.id()));
            verify(teamService, times(1)).getTeam(eq(teamC.id()));
        }

        @Test
        void should_map_game_completed() {
            // Given
            mockTeamService(teamA, teamB, teamC);

            // When
            Game game = gameService.toGame(RAW_GAME_1);

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
            mockTeamService(teamA, teamB);

            // When
            Game game = gameService.toGame(RAW_GAME_2);

            // Then
            assertThat(game.scoreA()).isEmpty();
            assertThat(game.scoreB()).isEmpty();
        }

        @Test
        void should_map_game_score_empty() {
            // Given
            mockTeamService(teamA, teamC);

            // When
            Game game = gameService.toGame(RAW_GAME_4);

            // Then
            assertThat(game.scoreA()).isEmpty();
            assertThat(game.scoreB()).isEmpty();
        }

        @Test
        void should_map_game_referee_empty() {
            // Given
            mockTeamService(teamA, teamB);

            // When
            Game game = gameService.toGame(RAW_GAME_5);

            // Then
            assertThat(game.referee()).isEmpty();
        }

    }

    @Nested
    @DisplayName("getGames()")
    class GetGames {

        @Test
        void should_user_range_in_config() {
            // Given
            String gameRange = "GameRange";
            when(sheetConfig.getGameRange()).thenReturn(gameRange);
            when(sheetService.readData(any())).thenReturn(Stream.of());

            // When
            gameService.getGames();

            // Then
            verify(sheetConfig, times(1)).getGameRange();
            verify(sheetService, times(1)).readData(eq(gameRange));
        }

        @Test
        void should_use_mapper_on_each_elements() {
            // Given
            when(sheetService.readData(any())).thenReturn(Stream.of(RAW_GAME_1, RAW_GAME_2, RAW_GAME_3));
            mockTeamService(teamA, teamB, teamC);

            // When
            gameService.getGames();

            // Then
            verify(gameService, times(3)).toGame(any());
            verify(gameService, times(1)).toGame(eq(RAW_GAME_1));
            verify(gameService, times(1)).toGame(eq(RAW_GAME_2));
            verify(gameService, times(1)).toGame(eq(RAW_GAME_3));
        }
    }


    @Nested
    @DisplayName("getGamesFor()")
    class GetGamesFor {

        @Test
        void should_filter_properly() {
            // Given
            when(sheetService.readData(any())).thenReturn(Stream.of(RAW_GAME_1, RAW_GAME_4, RAW_GAME_5));
            mockTeamService(teamA, teamB, teamC);

            // When
            List<Game> gamesFor = gameService.getGamesFor(teamB);

            // Then
            assertThat(gamesFor).map(Game::id).containsExactly("game1", "game5");
        }

    }

    @Nested
    @DisplayName("toRawData()")
    class ToRawData {

        @Test
        void should_handle_full_game() {
            // Given
            String court = "court";
            Game game = Game.builder()
                    .id("gameId")
                    .time(LocalDateTime.of(2022, AUGUST, 29, 10, 30))
                    .court(court)
                    .teamA(teamA)
                    .teamB(teamB)
                    .referee(teamC)
                    .scoreA(25)
                    .scoreB(14)
                    .build();

            // Given
            List<Object> rawData = gameService.toRawData(game);

            // Then
            assertThat(rawData).containsExactly("gameId", "29/08/2022", "10:30", court, teamA.id(), teamB.id(),
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