package com.gberard.tournament.infrastructure.repository;

import com.gberard.tournament.domain.model.Player;
import com.gberard.tournament.infrastructure.service.SpreadsheetCRUDService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.OptionalInt;

import static com.gberard.tournament.TestUtils.rawData;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SheetPlayerRepositoryTest {

    public static final List<Object> RAW_PLAYER_A = rawData("playerA", "firstnameA", "lastnameA");
    public static final List<Object> RAW_PLAYER_B = rawData("playerB", "firstnameB", "lastnameB");

    public static final Player PLAYER_A = new Player("playerA", "firstnameA", "lastnameA");
    public static final Player PLAYER_B = new Player("playerB", "firstnameB", "lastnameB");


    @Mock
    protected SpreadsheetCRUDService spreadsheetCRUDService;

    @Spy
    @InjectMocks
    private SheetPlayerRepository sheetPlayerRepository = new SheetPlayerRepository();

    @Nested
    @DisplayName("create()")
    class Create {

        @Test
        void shoud_use_crud_service() {
            // When
            sheetPlayerRepository.create(PLAYER_A);

            // Then
            verify(spreadsheetCRUDService, times(1))
                    .appendCells(eq(SheetPlayerRepository.RANGE), eq(List.of(RAW_PLAYER_A)));
        }

        @Test
        void shoud_use_toRawData_mapper() {
            // When
            sheetPlayerRepository.create(PLAYER_A);

            // Then
            verify(sheetPlayerRepository, times(1)).toRawData(eq(PLAYER_A));
        }

    }

    @Nested
    @DisplayName("readAll()")
    class ReadAll {

        @Test
        void shoud_use_crud_service() {
            // When
            sheetPlayerRepository.readAll();

            // Then
            verify(spreadsheetCRUDService, times(1)).readCells(eq(SheetPlayerRepository.RANGE));
        }

        @Test
        void shoud_use_fromRawData_mapper() {
            // Given
            when(spreadsheetCRUDService.readCells(eq(SheetPlayerRepository.RANGE))).thenReturn(List.of(RAW_PLAYER_A, RAW_PLAYER_B));

            // When
            sheetPlayerRepository.readAll();

            // Then
            verify(sheetPlayerRepository, times(1)).fromRawData(eq(RAW_PLAYER_A));
            verify(sheetPlayerRepository, times(1)).fromRawData(eq(RAW_PLAYER_B));
        }

        @Test
        void shoud_return_expected_teams() {
            // Given
            when(spreadsheetCRUDService.readCells(eq(SheetPlayerRepository.RANGE))).thenReturn(List.of(RAW_PLAYER_A, RAW_PLAYER_B));

            // When
            List<Player> teams = sheetPlayerRepository.readAll();

            // Then
            assertThat(teams).hasSize(2);
            assertThat(teams.get(0)).isEqualTo(PLAYER_A);
            assertThat(teams.get(1)).isEqualTo(PLAYER_B);
        }

    }

    @Nested
    @DisplayName("search()")
    class Search {

        @Test
        void should_return_team_if_present() {
            // Given
            when(spreadsheetCRUDService.readCells(eq(SheetPlayerRepository.RANGE))).thenReturn(List.of(RAW_PLAYER_A, RAW_PLAYER_B));

            // When
            Optional<Player> team = sheetPlayerRepository.search("playerB");

            // Then
            assertThat(team.isPresent()).isTrue();
            assertThat(team.get().id()).isEqualTo("playerB");
            assertThat(team.get().firstName()).isEqualTo("firstnameB");
            assertThat(team.get().lastName()).isEqualTo("lastnameB");
        }

        @Test
        void should_return_empty_if_absent() {
            // Given
            when(spreadsheetCRUDService.readCells(eq(SheetPlayerRepository.RANGE))).thenReturn(List.of(RAW_PLAYER_A, RAW_PLAYER_B));

            // When
            Optional<Player> team = sheetPlayerRepository.search("team2");

            // Then
            assertThat(team.isPresent()).isFalse();
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
            sheetPlayerRepository.update(PLAYER_A);

            // Then
            verify(spreadsheetCRUDService, times(1))
                    .findRowIndex(eq("Players!A:A"), eq(PLAYER_A.id()));
            verify(spreadsheetCRUDService, times(1))
                    .updateCells(eq("Players!A10"), eq(List.of(RAW_PLAYER_A)));
        }

        @Test
        void shoud_use_toRawData_mapper() {
            // Given
            when(spreadsheetCRUDService.findRowIndex(any(), any())).thenReturn(OptionalInt.of(10));

            // When
            sheetPlayerRepository.update(PLAYER_A);

            // Then
            verify(sheetPlayerRepository, times(1)).toRawData(eq(PLAYER_A));
        }

        @Test
        void shoud_not_delete_without_row_index() {
            // Given
            when(spreadsheetCRUDService.findRowIndex(any(), any())).thenReturn(OptionalInt.empty());

            // When
            sheetPlayerRepository.update(PLAYER_A);

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
            sheetPlayerRepository.delete(PLAYER_A);

            // Then
            verify(spreadsheetCRUDService, times(1)).findRowIndex(eq("Players!A:A"), eq(PLAYER_A.id()));
            verify(spreadsheetCRUDService, times(1)).deleteRaws(eq("Players"), eq(10), eq(1));
        }

        @Test
        void shoud_not_delete_without_row_index() {
            // Given
            when(spreadsheetCRUDService.findRowIndex(any(), any())).thenReturn(OptionalInt.empty());

            // When
            sheetPlayerRepository.delete(PLAYER_A);

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
            sheetPlayerRepository.deleteAll();

            // Then
            verify(spreadsheetCRUDService, times(1)).deleteRaws(eq("Players"), eq(1));
        }

    }

    @Nested
    @DisplayName("fromRawData()")
    class FromRawData {

        @Test
        void should_map_to_team() {
            // When
            Player team = sheetPlayerRepository.fromRawData(RAW_PLAYER_A);

            // Then
            assertThat(team.id()).isEqualTo("playerA");
            assertThat(team.firstName()).isEqualTo("firstnameA");
            assertThat(team.lastName()).isEqualTo("lastnameA");
        }

    }

    @Nested
    @DisplayName("toRawData()")
    class ToRawData {

        @Test
        void should_map_to_team() {
            // When
            List<Object> objects = sheetPlayerRepository.toRawData(PLAYER_A);

            // Then
            assertThat(objects).containsExactlyInAnyOrder(RAW_PLAYER_A.toArray());
        }

    }

}
