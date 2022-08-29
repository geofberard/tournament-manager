package com.gberard.tournament.service;

import com.gberard.tournament.config.SpreadsheetConfig;
import com.gberard.tournament.data.Team;
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
import java.util.stream.Stream;

import static com.gberard.tournament.data._TestUtils.rawData;
import static com.gberard.tournament.data._TestUtils.teamA;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeamServiceTest {

    public static final List<Object> RAW_TEAM_1 = rawData("team1", "Team1");
    public static final List<Object> RAW_TEAM_2 = rawData("team2", "Team2");

    @Spy
    @InjectMocks
    private TeamService teamService = new TeamService();

    @Mock
    private SheetService sheetService;

    @Mock
    private SpreadsheetConfig sheetConfig;

    @Nested
    @DisplayName("addTeam()")
    class AddTeam {
        @Test
        void should_user_range_in_config() {
            // Given
            String teamRange = "TeamRange";
            when(sheetConfig.getTeamRange()).thenReturn(teamRange);

            // When
            teamService.addTeam(teamA);

            // Then
            verify(sheetConfig,times(1)).getTeamRange();
            verify(sheetService,times(1)).create(eq(teamRange),any());
        }

        @Test
        void should_use_mapper_on_each_elements() {
            // Given
            when(sheetConfig.getTeamRange()).thenReturn("TeamRange");

            // When
            teamService.addTeam(teamA);

            // Then
            verify(teamService,times(1)).toRawData(eq(teamA));
        }
    }

    @Nested
    @DisplayName("getTeams()")
    class GetTeams {

        @Test
        void should_user_range_in_config() {
            // Given
            String teamRange = "TeamRange";
            when(sheetConfig.getTeamRange()).thenReturn(teamRange);
            when(sheetService.readAll(any())).thenReturn(Stream.of(rawData()));

            // When
            teamService.getTeams();

            // Then
            verify(sheetConfig,times(1)).getTeamRange();
            verify(sheetService,times(1)).readAll(eq(teamRange));
        }

        @Test
        void should_use_mapper_on_each_elements() {
            // Given
            when(sheetConfig.getTeamRange()).thenReturn("TeamRange");
            when(sheetService.readAll(any())).thenReturn(Stream.of(RAW_TEAM_1, RAW_TEAM_2));

            // When
            teamService.getTeams();

            // Then
            verify(teamService,times(2)).toTeam(any());
            verify(teamService,times(1)).toTeam(eq(RAW_TEAM_1));
            verify(teamService,times(1)).toTeam(eq(RAW_TEAM_2));
        }
    }

    @Nested
    @DisplayName("getTeam()")
    class GetTeam {

        @Test
        void should_return_team_if_present() {
            // Given
            when(sheetConfig.getTeamRange()).thenReturn("TeamRange");
            when(sheetService.readAll(any())).thenReturn(Stream.of(RAW_TEAM_1, RAW_TEAM_2));

            // When
            Optional<Team> team = teamService.getTeam("team2");

            // Then
            assertThat(team.isPresent()).isTrue();
            assertThat(team.get().id()).isEqualTo("team2");
            assertThat(team.get().name()).isEqualTo("Team2");
        }

        @Test
        void should_return_empty_if_absent() {
            // Given
            when(sheetConfig.getTeamRange()).thenReturn("TeamRange");
            when(sheetService.readAll(any())).thenReturn(Stream.of());

            // When
            Optional<Team> team = teamService.getTeam("team2");

            // Then
            assertThat(team.isPresent()).isFalse();
        }
    }

    @Nested
    @DisplayName("toTeam()")
    class ToTeam {

        @Test
        void should_map_to_team() {
            // When
            Team team = teamService.toTeam(RAW_TEAM_1);

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
            List<Object> objects = teamService.toRawData(teamA);

            // Then
            assertThat(objects).containsExactlyInAnyOrder(teamA.id(),teamA.name());
        }

    }

}