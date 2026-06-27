package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.stats.TeamStats;
import com.gberard.tournament.domain.port.output.GameRepository;
import com.gberard.tournament.domain.port.output.TeamRepository;
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
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.params.provider.Arguments.of;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TeamStatsServiceTest {

    List<Team> teams = List.of(TEAM_A, TEAM_B, TEAM_C, TEAM_D);

    List<Game> games = List.of(
            gameBuilder().contestants(List.of(TEAM_A, TEAM_B)).score(buildSimpleScore(TEAM_A, 25, TEAM_B, 15)).build(),
            gameBuilder().contestants(List.of(TEAM_A, TEAM_C)).score(buildSimpleScore(TEAM_A, 18, TEAM_C, 14)).build(),
            gameBuilder().contestants(List.of(TEAM_B, TEAM_C)).score(buildSimpleScore(TEAM_B, 22, TEAM_C, 19)).build(),
            gameBuilder().contestants(List.of(TEAM_D, TEAM_C)).score(buildSimpleScore(TEAM_D, 10, TEAM_C, 20)).build(),
            gameBuilder().contestants(List.of(TEAM_D, TEAM_B)).score(buildSimpleScore(TEAM_D, 10, TEAM_B, 10)).build()
    );

    @InjectMocks
    private TeamStatsService teamStatsService = new TeamStatsService();

    @Mock
    private GameRepository gameRepository;

    @Mock
    private TeamRepository teamRepository;

    @Nested
    @DisplayName("getTeamStats()")
    class GetTeamStats {

        static Stream<Arguments> getExpectedStats() {
            return Stream.of(
                    of(new TeamStats(TEAM_A, 2, 2, 0, 0, 6, 43, 29, 14)),
                    of(new TeamStats(TEAM_B, 3, 1, 1, 1, 4, 47, 54, -7)),
                    of(new TeamStats(TEAM_C, 3, 1, 0, 2, 3, 53, 50, 3)),
                    of(new TeamStats(TEAM_D, 2, 0, 1, 1, 1, 20, 30, -10)),
                    of(new TeamStats(TEAM_E, 0, 0, 0, 0, 0, 0, 0, 0))
            );
        }

        @ParameterizedTest
        @MethodSource("getExpectedStats")
        void should_return_team_stats(TeamStats expected) {
            when(gameRepository.findByTeamId(expected.team().id())).thenReturn(
                    games.stream()
                            .filter(game -> game.contestants().stream().anyMatch(team -> team.id().equals(expected.team().id())))
                            .toList()
            );

            TeamStats stats = teamStatsService.getTeamStats(expected.team());

            assertThat(stats).isEqualTo(expected);
        }
    }

    @Nested
    @DisplayName("getTeamsStats()")
    class GetTeamsStats {

        @Test
        void should_return_teams_stats() {
            when(teamRepository.findAll()).thenReturn(teams.stream()
                    .map(team -> new Team(team.id(), team.id()))
                    .toList());
            teams.forEach(team -> when(gameRepository.findByTeamId(team.id())).thenReturn(
                    games.stream()
                            .filter(game -> game.contestants().stream().anyMatch(contestant -> contestant.id().equals(team.id())))
                            .toList()
            ));

            List<TeamStats> teamsStats = teamStatsService.getTeamsStats();

            assertThat(teamsStats).hasSize(teams.size());
            assertThat(teamsStats.stream().map(TeamStats::team).toList())
                    .containsAll(teams);
        }
    }

    @Nested
    @DisplayName("getTeamsStatsByPhase()")
    class GetTeamsStatsByPhase {

        @Test
        void should_return_only_phase_stats() {
            when(gameRepository.findByPhaseId(PHASE_A.id())).thenReturn(games.subList(0, 3));

            List<TeamStats> teamsStats = teamStatsService.getTeamsStatsByPhase(PHASE_A.id());

            assertThat(teamsStats).containsExactlyInAnyOrder(
                    new TeamStats(TEAM_A, 2, 2, 0, 0, 6, 43, 29, 14),
                    new TeamStats(TEAM_B, 2, 1, 0, 1, 3, 37, 44, -7),
                    new TeamStats(TEAM_C, 2, 0, 0, 2, 0, 33, 40, -7)
            );
        }
    }

}
