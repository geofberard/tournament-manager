package com.gberard.tournament.infrastructure.service;

import com.gberard.tournament.domain.stats.ContestantStats;
import com.gberard.tournament.domain.client.Game;
import com.gberard.tournament.domain.client.Team;
import com.gberard.tournament.infrastructure.repository.SheetGameRepository;
import com.gberard.tournament.infrastructure.repository.SheetTeamRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.stream.Stream;

import static com.gberard.tournament.TestUtils.*;
import static java.util.stream.Collectors.toList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.params.provider.Arguments.of;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ContestantStatsServiceTest {

    List<String> teams = List.of(TEAM_A, TEAM_B, TEAM_C, TEAM_D);

    List<Game> games = List.of(
            buildGame(TEAM_A, 25, TEAM_B, 15),
            buildGame(TEAM_A, 18, TEAM_C, 14),
            buildGame(TEAM_B, 22, TEAM_C, 19),
            buildGame(TEAM_D, 10, TEAM_C, 20),
            buildGame(TEAM_D, 10, TEAM_B, 10)
    );

    @InjectMocks
    private ContestantStatsService teamStatsService = new ContestantStatsService();

    @Mock
    private SheetGameRepository gameService;

    @Mock
    private SheetTeamRepository teamService;

    @Nested
    @DisplayName("getTeamStats()")
    class GetTeamStats {

        public static Stream<Arguments> getExpectedStats() {
            return Stream.of(
                    of(new ContestantStats(TEAM_A, 2, 2, 0, 0, 6, 43, 29, 14)),
                    of(new ContestantStats(TEAM_B, 3, 1, 1, 1, 4, 47, 54, -7)),
                    of(new ContestantStats(TEAM_C, 3, 1, 0, 2, 3, 53, 50, 3)),
                    of(new ContestantStats(TEAM_D, 2, 0, 1, 1, 1, 20, 30, -10)),
                    of(new ContestantStats(TEAM_E, 0, 0, 0, 0, 0, 0, 0, 0))
            );
        }

        @ParameterizedTest
        @MethodSource("getExpectedStats")
        void should_return_team_stats(ContestantStats expected) {
            // Given
            when(gameService.readAll()).thenReturn(games);

            // When
            ContestantStats stats = teamStatsService.getTeamStats(expected.contestantId());

            // Then
            assertThat(stats).isEqualTo(expected);
        }
    }

    @Nested
    @DisplayName("getTeamsStats()")
    class GetTeamsStats {

        @Test
        void should_return_teams_stats() {
            // Given
            when(teamService.readAll()).thenReturn(teams.stream()
                    .map(teamId -> new Team(teamId, teamId, List.of()))
                    .toList());
            when(gameService.readAll()).thenReturn(games);

            // When
            List<ContestantStats> teamsStats = teamStatsService.getTeamsStats();

            // Then
            assertThat(teamsStats).hasSize(teams.size());
            assertThat(teamsStats.stream().map(ContestantStats::contestantId).collect(toList()))
                    .containsAll(teams);
        }
    }
}
