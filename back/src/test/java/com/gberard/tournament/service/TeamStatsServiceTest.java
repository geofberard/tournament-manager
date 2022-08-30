package com.gberard.tournament.service;

import com.gberard.tournament.data.Game;
import com.gberard.tournament.data.Team;
import com.gberard.tournament.data.TeamStats;
import com.gberard.tournament.repository.GameRepository;
import com.gberard.tournament.repository.TeamRepository;
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

import static com.gberard.tournament.data._TestUtils.*;
import static java.util.stream.Collectors.toList;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.params.provider.Arguments.of;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TeamStatsServiceTest {

    @InjectMocks
    private TeamStatsService teamStatsService = new TeamStatsService();

    @Mock
    private TeamRepository teamService;

    @Mock
    private GameRepository gameService;

    List<Team> teams = List.of(teamA, teamB, teamC, teamD);

    List<Game> games = List.of(
            buildGame(teamA, 25, teamB, 15),
            buildGame(teamA, 18, teamC, 14),
            buildGame(teamB, 22, teamC, 19),
            buildGame(teamD, 10, teamC, 20),
            buildGame(teamD, 10, teamB, 10)
    );

    @Nested
    @DisplayName("getTeamStats()")
    class GetTeamStats {

        public static Stream<Arguments> getExpectedStats() {
            return Stream.of(
                    of(new TeamStats(teamA, 2, 2, 0, 0, 6, 43, 29, 14)),
                    of(new TeamStats(teamB, 3, 1, 1, 1, 4, 47, 54, -7)),
                    of(new TeamStats(teamC, 3, 1, 0, 2, 3, 53, 50, 3)),
                    of(new TeamStats(teamD, 2, 0, 1, 1, 1, 20, 30, -10)),
                    of(new TeamStats(teamE, 0, 0, 0, 0, 0, 0, 0, 0))
            );
        }

        @ParameterizedTest
        @MethodSource("getExpectedStats")
        void should_return_team_stats(TeamStats expected) {
            // Given
            when(gameService.readAll()).thenReturn(games);

            // When
            TeamStats stats = teamStatsService.getTeamStats(expected.team());

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
            when(teamService.readAll()).thenReturn(teams);
            when(gameService.readAll()).thenReturn(games);

            // When
            List<TeamStats> teamsStats = teamStatsService.getTeamsStats();

            // Then
            assertThat(teamsStats).hasSize(teams.size());
            assertThat(teamsStats.stream().map(TeamStats::team).collect(toList()))
                    .containsAll(teams);
        }
    }
}
