package com.gberard.tournament.infrastructure.repository;

import com.gberard.tournament.domain.score.DepthOneScore;
import com.gberard.tournament.domain.score.DepthTwoScore;
import com.gberard.tournament.domain.client.Game;
import com.gberard.tournament.infrastructure.service.SpreadsheetCRUDService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.OptionalInt;

import static com.gberard.tournament.domain.score.ScoreType.DepthOne;
import static com.gberard.tournament.domain.score.ScoreType.DepthTwo;
import static com.gberard.tournament.TestUtils.*;
import static com.gberard.tournament.infrastructure.repository.SheetGameRepository.RANGE;
import static java.time.Month.AUGUST;
import static java.util.List.of;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class SheetGameRepositoryTest {

    private static final List<Object> RAW_GAME_1 =
            rawData("game1", "29/08/2022", "10:30", "court", "teamA;teamB", "teamC", "true", "DepthOne", "25-12");

    private static final List<Object> RAW_GAME_2 =
            rawData("game2", "29/08/2022", "11:30", "court", "teamA;teamC", "teamB", "true", "DepthTwo", "25-12;14-25");

    private static final List<Object> RAW_GAME_3 =
            rawData("game3", "29/08/2022", "12:30", "court", "teamC;teamB", "", "false", "DepthOne");



    private static final Game GAME_1 = Game.builder()
            .id("game1")
            .time(LocalDateTime.of(2022, AUGUST, 29, 10, 30))
            .court("court")
            .contestantIds(of(TEAM_A, TEAM_B))
            .refereeId(TEAM_C)
            .isFinished(true)
            .scoreType(DepthOne)
            .score(buildDepthOneScore(TEAM_A, 25, TEAM_B, 12))
            .build();

    private static final Game GAME_2 = Game.builder()
            .id("game2")
            .time(LocalDateTime.of(2022, AUGUST, 29, 11, 30))
            .court("court")
            .contestantIds(of(TEAM_A, TEAM_C))
            .refereeId(TEAM_B)
            .isFinished(true)
            .scoreType(DepthTwo)
            .score(buildDepthTwoScore(TEAM_A, of(25, 14), TEAM_C, of(12, 25)))
            .build();

    private static final Game GAME_3 = Game.builder()
            .id("game3")
            .time(LocalDateTime.of(2022, AUGUST, 29, 12, 30))
            .court("court")
            .contestantIds(of(TEAM_C, TEAM_B))
            .isFinished(false)
            .scoreType(DepthOne)
            .build();


    @Spy
    @InjectMocks
    private SheetGameRepository sheetGameRepository;

    @Mock
    protected SpreadsheetCRUDService spreadsheetCRUDService;

    @Nested
    @DisplayName("create()")
    class Create {

        @Test
        void shoud_use_crud_service() {
            // When
            sheetGameRepository.create(GAME_1);

            // Then
            verify(spreadsheetCRUDService, times(1))
                    .appendCells(eq(RANGE), any());
        }

        @Test
        void shoud_use_toRawData_mapper() {
            // When
            sheetGameRepository.create(GAME_1);

            // Then
            verify(sheetGameRepository, times(1)).toRawData(eq(GAME_1));
        }

    }

    @Nested
    @DisplayName("readAll()")
    class ReadAll {

        @Test
        void shoud_use_crud_service() {
            // When
            sheetGameRepository.readAll();

            // Then
            verify(spreadsheetCRUDService, times(1)).readCells(eq(RANGE));
        }

        @Test
        void shoud_use_fromRawData_mapper() {
            // Given
            when(spreadsheetCRUDService.readCells(eq(RANGE))).thenReturn(of(RAW_GAME_1, RAW_GAME_3));

            // When
            sheetGameRepository.readAll();

            // Then
            verify(sheetGameRepository, times(1)).fromRawData(eq(RAW_GAME_1));
            verify(sheetGameRepository, times(1)).fromRawData(eq(RAW_GAME_3));
        }

        @Test
        void shoud_return_deserialized_game() {
            // Given
            when(spreadsheetCRUDService.readCells(eq(RANGE))).thenReturn(of(RAW_GAME_1, RAW_GAME_3));

            // When
            List<Game> teams = sheetGameRepository.readAll();

            // Then
            assertThat(teams).hasSize(2);
            assertThat(teams.get(0)).isEqualTo(GAME_1);
            assertThat(teams.get(1)).isEqualTo(GAME_3);
        }

    }

    @Nested
    @DisplayName("searchFor()")
    class SearchFor {

        @Test
        void should_filter_properly() {
            // Given
            when(spreadsheetCRUDService.readCells(eq(RANGE))).thenReturn(of(RAW_GAME_1, RAW_GAME_2, RAW_GAME_3));

            // When
            List<Game> gamesFor = sheetGameRepository.searchFor("teamB");

            // Then
            assertThat(gamesFor).map(Game::id).containsExactly("game1", "game3");
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
            sheetGameRepository.update(GAME_1);

            // Then
            verify(spreadsheetCRUDService, times(1))
                    .findRowIndex(eq("Games!A:A"), eq(GAME_1.id()));
            verify(spreadsheetCRUDService, times(1))
                    .updateCells(eq("Games!A10"), any());
        }

        @Test
        void shoud_use_toRawData_mapper() {
            // Given
            when(spreadsheetCRUDService.findRowIndex(any(), any())).thenReturn(OptionalInt.of(10));

            // When
            sheetGameRepository.update(GAME_1);

            // Then
            verify(sheetGameRepository, times(1)).toRawData(eq(GAME_1));
        }

        @Test
        void shoud_not_delete_without_row_index() {
            // Given
            when(spreadsheetCRUDService.findRowIndex(any(), any())).thenReturn(OptionalInt.empty());

            // When
            sheetGameRepository.update(GAME_1);

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
            sheetGameRepository.delete(GAME_1);

            // Then
            verify(spreadsheetCRUDService, times(1)).findRowIndex(eq("Games!A:A"), eq(GAME_1.id()));
            verify(spreadsheetCRUDService, times(1)).deleteRaws(eq("Games"), eq(10), eq(1));
        }

        @Test
        void shoud_not_delete_without_row_index() {
            // Given
            when(spreadsheetCRUDService.findRowIndex(any(), any())).thenReturn(OptionalInt.empty());

            // When
            sheetGameRepository.delete(GAME_1);

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
            sheetGameRepository.deleteAll();

            // Then
            verify(spreadsheetCRUDService, times(1)).deleteRaws(eq("Games"), eq(1));
        }

    }


    @Nested
    @DisplayName("fromRawData()")
    class FromRawData {

        @Test
        void should_map_game_completed_depth_one() {
            // When
            Game game = sheetGameRepository.fromRawData(RAW_GAME_1);

            // Then
            assertThat(game.id()).isEqualTo("game1");
            assertThat(game.time()).isEqualTo(LocalDateTime.of(2022, 8, 29, 10, 30));
            assertThat(game.court()).isEqualTo("court");
            assertThat(game.contestantIds()).containsExactly("teamA","teamB");
            assertThat(game.refereeId()).isNotEmpty().hasValue("teamC");
            assertThat(game.scoreType()).isEqualTo(DepthOne);
            assertThat(game.isFinished()).isTrue();
            assertThat(game.score()).isNotEmpty().get().isOfAnyClassIn(DepthOneScore.class);
            assertThatScore(game.score().get(), "teamA").containsExactly(25);
            assertThatScore(game.score().get(), "teamB").containsExactly(12);
        }

        @Test
        void should_map_game_completed_depth_two() {
            // When
            Game game = sheetGameRepository.fromRawData(RAW_GAME_2);

            // Then
            assertThat(game.id()).isEqualTo("game2");
            assertThat(game.time()).isEqualTo(LocalDateTime.of(2022, 8, 29, 11, 30));
            assertThat(game.court()).isEqualTo("court");
            assertThat(game.contestantIds()).containsExactly("teamA","teamC");
            assertThat(game.refereeId()).isNotEmpty().hasValue("teamB");
            assertThat(game.scoreType()).isEqualTo(DepthTwo);
            assertThat(game.isFinished()).isTrue();
            assertThat(game.score()).isNotEmpty().get().isOfAnyClassIn(DepthTwoScore.class);
            assertThatScore(game.score().get(), "teamA").containsExactly(25, 14);
            assertThatScore(game.score().get(), "teamC").containsExactly(12, 25);
        }

        @Test
        void should_map_game_scoreless() {
            // When
            Game game = sheetGameRepository.fromRawData(RAW_GAME_3);

            // Then
            assertThat(game.id()).isEqualTo("game3");
            assertThat(game.time()).isEqualTo(LocalDateTime.of(2022, 8, 29, 12, 30));
            assertThat(game.court()).isEqualTo("court");
            assertThat(game.contestantIds()).containsExactly("teamC","teamB");
            assertThat(game.refereeId()).isEmpty();
            assertThat(game.isFinished()).isFalse();
            assertThat(game.scoreType()).isEqualTo(DepthOne);
            assertThat(game.score()).isEmpty();
        }

        @Test
        void should_map_game_score_empty() {
            // Given
            List<Object> rawGame =
                    rawData("game4", "23/08/2022", "13:00", "Court1", "teamA;teamC", "", "false", "DepthOne");

            // When
            Game game = sheetGameRepository.fromRawData(rawGame);

            // Then
            assertThat(game.score()).isEmpty();
        }

    }

    @Nested
    @DisplayName("toRawData()")
    class ToRawData {

        @Test
        void should_handle_full_game_dept_one() {
            // Given
            List<Object> rawData = sheetGameRepository.toRawData(GAME_1);

            // Then
            assertThat(rawData).containsExactly("game1", "29/08/2022", "10:30", "court", "teamA;teamB",
                    "teamC", "true", "DepthOne", "25-12");
        }

        @Test
        void should_handle_full_game_dept_two() {
            // Given
            List<Object> rawData = sheetGameRepository.toRawData(GAME_2);

            // Then
            assertThat(rawData).containsExactly("game2", "29/08/2022", "11:30", "court", "teamA;teamC",
                    "teamB", "true", "DepthTwo", "25-12;14-25");
        }

        @Test
        void should_handle_partiel_game() {
            // Given
            List<Object> rawData = sheetGameRepository.toRawData(GAME_3);

            // Then
            assertThat(rawData)
                    .containsExactly("game3", "29/08/2022", "12:30", "court", "teamC;teamB",
                            "", "false", "DepthOne", "");
        }

    }

}
