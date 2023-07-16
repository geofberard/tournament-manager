package com.gberard.tournament.repository;

import com.gberard.tournament.data.GameV1;
import com.gberard.tournament.data.TeamV1;
import com.gberard.tournament.service.SpreadsheetCRUDService;
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
import java.util.OptionalInt;

import static com.gberard.tournament.data._TestUtils.*;
import static com.gberard.tournament.repository.GameRepository.RANGE;
import static java.time.Month.AUGUST;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class GameRepositoryTest {

    private static final List<Object> RAW_GAME_1 =
            rawData("game1", "29/08/2022", "10:30", "court", "teamA", "teamB", "teamC", "25", "14");
    private static final List<Object> RAW_GAME_2 =
            rawData("game2", "29/08/2022", "11:30", "court", "teamC", "teamB");
    private static final List<Object> RAW_GAME_3 =
            rawData("game3", "29/08/2022", "13:30", "court", "teamA", "teamC", "", "", "");
    private static final List<Object> RAW_GAME_4 =
            rawData("game4", "29/08/2022", "14:30", "court", "teamA", "teamB", "");


    @Spy
    @InjectMocks
    private GameRepository gameRepository;

    @Mock
    protected SpreadsheetCRUDService spreadsheetCRUDService;

    @Mock
    private TeamV1Repository teamRepository;

    private void mockTeamService(TeamV1... teams) {
        if (teams.length == 0) {
            when(teamRepository.search(any())).thenReturn(Optional.of(oldTeamA));
        } else {
            Arrays.stream(teams)
                    .forEach(team -> when(teamRepository.search(eq(team.id()))).thenReturn(Optional.of(team)));
        }
    }

    @Nested
    @DisplayName("create()")
    class Create {

        @Test
        void shoud_use_crud_service() {
            // When
            gameRepository.create(game1);

            // Then
            verify(spreadsheetCRUDService, times(1))
                    .appendCells(eq(RANGE), eq(List.of(RAW_GAME_1)));
        }

        @Test
        void shoud_use_toRawData_mapper() {
            // When
            gameRepository.create(game1);

            // Then
            verify(gameRepository, times(1)).toRawData(eq(game1));
        }

    }

    @Nested
    @DisplayName("readAll()")
    class ReadAll {

        @Test
        void shoud_use_crud_service() {
            // When
            gameRepository.readAll();

            // Then
            verify(spreadsheetCRUDService, times(1)).readCells(eq(RANGE));
        }

        @Test
        void shoud_use_fromRawData_mapper() {
            // Given
            when(spreadsheetCRUDService.readCells(eq(RANGE))).thenReturn(List.of(RAW_GAME_1, RAW_GAME_2));
            mockTeamService(oldTeamA, oldTeamB, oldTeamC);

            // When
            gameRepository.readAll();

            // Then
            verify(gameRepository, times(1)).fromRawData(eq(RAW_GAME_1));
            verify(gameRepository, times(1)).fromRawData(eq(RAW_GAME_2));
        }

        @Test
        void shoud_return_deserialized_game() {
            // Given
            when(spreadsheetCRUDService.readCells(eq(RANGE))).thenReturn(List.of(RAW_GAME_1, RAW_GAME_2));
            mockTeamService(oldTeamA, oldTeamB, oldTeamC);

            // When
            List<GameV1> teams = gameRepository.readAll();

            // Then
            assertThat(teams).hasSize(2);
            assertThat(teams.get(0)).isEqualTo(game1);
            assertThat(teams.get(1)).isEqualTo(game2);
        }

    }

    @Nested
    @DisplayName("searchFor()")
    class SearchFor {

        @Test
        void should_filter_properly() {
            // Given
            when(spreadsheetCRUDService.readCells(eq(RANGE))).thenReturn(List.of(RAW_GAME_1, RAW_GAME_3, RAW_GAME_4));
            mockTeamService(oldTeamA, oldTeamB, oldTeamC);

            // When
            List<GameV1> gamesFor = gameRepository.searchFor(oldTeamB);

            // Then
            assertThat(gamesFor).map(GameV1::id).containsExactly("game1", "game4");
        }

    }

    @Nested
    @DisplayName("update()")
    class Update {

        @Test
        void shoud_use_crud_service() {
            // Given
            when(spreadsheetCRUDService.findRowIndex(any(), any())).thenReturn(OptionalInt.of(10));

            // When
            gameRepository.update(game1);

            // Then
            verify(spreadsheetCRUDService, times(1))
                    .findRowIndex(eq("Games!A:A"), eq(game1.id()));
            verify(spreadsheetCRUDService, times(1))
                    .updateCells(eq("Games!A10"), eq(List.of(RAW_GAME_1)));
        }

        @Test
        void shoud_use_toRawData_mapper() {
            // Given
            when(spreadsheetCRUDService.findRowIndex(any(), any())).thenReturn(OptionalInt.of(10));

            // When
            gameRepository.update(game1);

            // Then
            verify(gameRepository, times(1)).toRawData(eq(game1));
        }

        @Test
        void shoud_not_delete_without_row_index() {
            // Given
            when(spreadsheetCRUDService.findRowIndex(any(), any())).thenReturn(OptionalInt.empty());

            // When
            gameRepository.update(game1);

            // Then
            verify(spreadsheetCRUDService, never()).updateCells(any(), any());
        }

    }

    @Nested
    @DisplayName("delete()")
    class Delete {

        @Test
        void shoud_use_crud_service() {
            // Given
            when(spreadsheetCRUDService.findRowIndex(any(), any())).thenReturn(OptionalInt.of(11));

            // When
            gameRepository.delete(game1);

            // Then
            verify(spreadsheetCRUDService, times(1)).findRowIndex(eq("Games!A:A"), eq(game1.id()));
            verify(spreadsheetCRUDService, times(1)).deleteRaws(eq("Games"), eq(10), eq(1));
        }

        @Test
        void shoud_not_delete_without_row_index() {
            // Given
            when(spreadsheetCRUDService.findRowIndex(any(), any())).thenReturn(OptionalInt.empty());

            // When
            gameRepository.delete(game1);

            // Then
            verify(spreadsheetCRUDService, never()).deleteRaws(any(), anyInt());
            verify(spreadsheetCRUDService, never()).deleteRaws(any(), anyInt(), anyInt());
        }

    }

    @Nested
    @DisplayName("deleteAll()")
    class DeleteAll {

        @Test
        void shoud_use_crud_service() {
            // When
            gameRepository.deleteAll();

            // Then
            verify(spreadsheetCRUDService, times(1)).deleteRaws(eq("Games"), eq(1));
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
            mockTeamService(oldTeamA, oldTeamB, oldTeamC);

            // When
            GameV1 game = gameRepository.fromRawData(rawGame);

            // Then
            verify(teamRepository, times(1)).search(eq(oldTeamA.id()));
            verify(teamRepository, times(1)).search(eq(oldTeamB.id()));
            verify(teamRepository, times(1)).search(eq(oldTeamC.id()));
        }

        @Test
        void should_map_game_completed() {
            // Given
            List<Object> rawGame =
                    rawData("game1", "23/08/2022", "10:00", "Court1", "teamA", "teamB", "teamC", "25", "16");
            mockTeamService(oldTeamA, oldTeamB, oldTeamC);

            // When
            GameV1 game = gameRepository.fromRawData(rawGame);

            // Then
            assertThat(game.id()).isEqualTo("game1");
            assertThat(game.time()).isEqualTo(LocalDateTime.of(2022, 8, 23, 10, 0));
            assertThat(game.court()).isEqualTo("Court1");
            assertThat(game.teamA()).isEqualTo(oldTeamA);
            assertThat(game.teamB()).isEqualTo(oldTeamB);
            assertThat(game.referee()).isNotEmpty().hasValue(oldTeamC);
            assertThat(game.scoreA()).isNotEmpty().hasValue(25);
            assertThat(game.scoreB()).isNotEmpty().hasValue(16);
        }

        @Test
        void should_map_game_scoreless() {
            // Given
            List<Object> rawGame = rawData("game2", "23/08/2022", "11:00", "Court1", "teamA", "teamB", "teamC");
            mockTeamService(oldTeamA, oldTeamB);

            // When
            GameV1 game = gameRepository.fromRawData(rawGame);

            // Then
            assertThat(game.scoreA()).isEmpty();
            assertThat(game.scoreB()).isEmpty();
        }

        @Test
        void should_map_game_score_empty() {
            // Given
            List<Object> rawGame = rawData("game4", "23/08/2022", "13:00", "Court1", "teamA", "teamC", "", "", "");
            mockTeamService(oldTeamA, oldTeamC);

            // When
            GameV1 game = gameRepository.fromRawData(rawGame);

            // Then
            assertThat(game.scoreA()).isEmpty();
            assertThat(game.scoreB()).isEmpty();
        }

        @Test
        void should_map_game_referee_empty() {
            // Given
            List<Object> rawGame = rawData("game5", "23/08/2022", "14:00", "Court1", "teamA", "teamB", "");
            mockTeamService(oldTeamA, oldTeamB);

            // When
            GameV1 game = gameRepository.fromRawData(rawGame);

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
            List<Object> rawData = gameRepository.toRawData(game1);

            // Then
            assertThat(rawData).containsExactly("game1", "29/08/2022", "10:30", game1.court(), oldTeamA.id(), oldTeamB.id(),
                    oldTeamC.id(), "25", "14");
        }

        @Test
        void should_handle_partiel_game() {
            // Given
            String court = "court";
            GameV1 game = GameV1.builder()
                    .id("gameId")
                    .time(LocalDateTime.of(2022, AUGUST, 29, 10, 30))
                    .court(court)
                    .teamA(oldTeamA)
                    .teamB(oldTeamB)
                    .build();

            // Given
            List<Object> rawData = gameRepository.toRawData(game);

            // Then
            assertThat(rawData)
                    .containsExactly("gameId", "29/08/2022", "10:30", court, oldTeamA.id(), oldTeamB.id(), "", "", "");
        }

    }

}