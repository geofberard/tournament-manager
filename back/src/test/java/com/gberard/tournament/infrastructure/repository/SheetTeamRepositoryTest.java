package com.gberard.tournament.infrastructure.repository;

import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.infrastructure.serializer.ListRaw;
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
import static com.gberard.tournament.infrastructure.repository.SheetTeamRepository.RANGE;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SheetTeamRepositoryTest {

    public static final List<Object> RAW_TEAM_A = rawData("teamA", "TeamA", "playerA;playerB");
    public static final List<Object> RAW_TEAM_B = rawData("teamB", "TeamB", "playerC;playerD");

    public static final Team TEAM_A = new Team("teamA", "TeamA", List.of("playerA", "playerB"));
    public static final Team TEAM_B = new Team("teamB", "TeamB", List.of("playerC", "playerD"));

    @Mock
    protected SpreadsheetCRUDService spreadsheetCRUDService;

    @Spy
    @InjectMocks
    private SheetTeamRepository sheetTeamRepository = new SheetTeamRepository();

    @Nested
    @DisplayName("create()")
    class Create {

        @Test
        void shoud_use_crud_service() {
            // When
            sheetTeamRepository.create(TEAM_A);

            // Then
            verify(spreadsheetCRUDService, times(1))
                    .appendCells(eq(RANGE), eq(List.of(RAW_TEAM_A)));
        }

        @Test
        void shoud_use_toRawData_mapper() {
            // When
            sheetTeamRepository.create(TEAM_A);

            // Then
            verify(sheetTeamRepository, times(1)).toRawData(eq(TEAM_A));
        }

    }

    @Nested
    @DisplayName("readAll()")
    class ReadAll {

        @Test
        void shoud_use_crud_service() {
            // When
            sheetTeamRepository.readAll();

            // Then
            verify(spreadsheetCRUDService, times(1)).readCells(eq(RANGE));
        }

        @Test
        void shoud_use_fromRawData_mapper() {
            // Given
            when(spreadsheetCRUDService.readCells(eq(RANGE))).thenReturn(List.of(RAW_TEAM_A, RAW_TEAM_B));

            // When
            sheetTeamRepository.readAll();

            // Then
            verify(sheetTeamRepository, times(1)).fromRawData(eq(RAW_TEAM_A));
            verify(sheetTeamRepository, times(1)).fromRawData(eq(RAW_TEAM_B));
        }

        @Test
        void shoud_return_expected_teams() {
            // Given
            when(spreadsheetCRUDService.readCells(eq(RANGE))).thenReturn(List.of(RAW_TEAM_A, RAW_TEAM_B));

            // When
            List<Team> teams = sheetTeamRepository.readAll();

            // Then
            assertThat(teams).hasSize(2);
            assertThat(teams.get(0)).isEqualTo(TEAM_A);
            assertThat(teams.get(1)).isEqualTo(TEAM_B);
        }

    }

    @Nested
    @DisplayName("search()")
    class Search {

        @Test
        void should_return_team_if_present() {
            // Given
            when(spreadsheetCRUDService.readCells(eq(RANGE))).thenReturn(List.of(RAW_TEAM_A, RAW_TEAM_B));

            // When
            Optional<Team> team = sheetTeamRepository.search("teamB");

            // Then
            assertThat(team.isPresent()).isTrue();
            assertThat(team.get().id()).isEqualTo("teamB");
            assertThat(team.get().name()).isEqualTo("TeamB");
        }

        @Test
        void should_return_empty_if_absent() {
            // Given
            when(spreadsheetCRUDService.readCells(eq(RANGE))).thenReturn(List.of(RAW_TEAM_A, RAW_TEAM_B));

            // When
            Optional<Team> team = sheetTeamRepository.search("team2");

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
            sheetTeamRepository.update(TEAM_A);

            // Then
            verify(spreadsheetCRUDService, times(1))
                    .findRowIndex(eq("Teams!A:A"), eq(TEAM_A.id()));
            verify(spreadsheetCRUDService, times(1))
                    .updateCells(eq("Teams!A10"), eq(List.of(RAW_TEAM_A)));
        }

        @Test
        void shoud_use_toRawData_mapper() {
            // Given
            when(spreadsheetCRUDService.findRowIndex(any(), any())).thenReturn(OptionalInt.of(10));

            // When
            sheetTeamRepository.update(TEAM_A);

            // Then
            verify(sheetTeamRepository, times(1)).toRawData(eq(TEAM_A));
        }

        @Test
        void shoud_not_delete_without_row_index() {
            // Given
            when(spreadsheetCRUDService.findRowIndex(any(), any())).thenReturn(OptionalInt.empty());

            // When
            sheetTeamRepository.update(TEAM_A);

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
            sheetTeamRepository.delete(TEAM_A);

            // Then
            verify(spreadsheetCRUDService, times(1)).findRowIndex(eq("Teams!A:A"), eq(TEAM_A.id()));
            verify(spreadsheetCRUDService, times(1)).deleteRaws(eq("Teams"), eq(10), eq(1));
        }

        @Test
        void shoud_not_delete_without_row_index() {
            // Given
            when(spreadsheetCRUDService.findRowIndex(any(), any())).thenReturn(OptionalInt.empty());

            // When
            sheetTeamRepository.delete(TEAM_A);

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
            sheetTeamRepository.deleteAll();

            // Then
            verify(spreadsheetCRUDService, times(1)).deleteRaws(eq("Teams"), eq(1));
        }

    }

    @Nested
    @DisplayName("fromRawData()")
    class FromRawData {

        @Test
        void should_map_to_team() {
            // Given
            List<Object> RAW_TEAM_1 = rawData("team1", "Team1", "");

            // When
            Team team = sheetTeamRepository.fromRawData(RAW_TEAM_1);

            // Then
            assertThat(team.id()).isEqualTo("team1");
            assertThat(team.name()).isEqualTo("Team1");
        }

    }

    @Nested
    @DisplayName("toRawData()")
    class ToRawData {

        @Test
        void should_map_to_team() {
            // When
            List<Object> objects = sheetTeamRepository.toRawData(TEAM_A);

            // Then
            assertThat(objects)
                    .containsExactlyInAnyOrder(TEAM_A.id(), TEAM_A.name(), ListRaw.serialize(TEAM_A.playerIds()));
        }

    }

}
