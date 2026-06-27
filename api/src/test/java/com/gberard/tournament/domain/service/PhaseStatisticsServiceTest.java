package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.GameStatus;
import com.gberard.tournament.domain.model.Phase;
import com.gberard.tournament.domain.model.PhaseType;
import com.gberard.tournament.domain.model.stats.PhaseStatistics;
import com.gberard.tournament.domain.model.stats.TeamStats;
import com.gberard.tournament.domain.port.output.GameRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static com.gberard.tournament.TestUtils.PHASE_A;
import static com.gberard.tournament.TestUtils.TEAM_A;
import static com.gberard.tournament.TestUtils.TEAM_B;
import static com.gberard.tournament.TestUtils.TEAM_C;
import static com.gberard.tournament.TestUtils.buildSimpleScore;
import static com.gberard.tournament.TestUtils.gameBuilder;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PhaseStatisticsServiceTest {

    @InjectMocks
    private PhaseStatisticsService phaseStatisticsService = new PhaseStatisticsService();

    @Mock
    private GameRepository gameRepository;

    @Test
    void should_return_phase_statistics() {
        when(gameRepository.findAll()).thenReturn(List.of(
                gameBuilder()
                        .id("game-1")
                        .contestants(List.of(TEAM_A, TEAM_B))
                        .status(GameStatus.COMPLETED)
                        .score(buildSimpleScore(TEAM_A, 25, TEAM_B, 15))
                        .build(),
                gameBuilder()
                        .id("game-2")
                        .contestants(List.of(TEAM_B, TEAM_C))
                        .status(GameStatus.SCHEDULED)
                        .build(),
                gameBuilder()
                        .id("game-3")
                        .contestants(List.of(TEAM_A, TEAM_C))
                        .status(GameStatus.COMPLETED)
                        .score(buildSimpleScore(TEAM_A, 18, TEAM_C, 14))
                        .build(),
                gameBuilder()
                        .id("game-4")
                        .contestants(List.of(TEAM_A, TEAM_B))
                        .status(GameStatus.SCHEDULED)
                        .build()
        ));

        PhaseStatistics statistics = phaseStatisticsService.getPhaseStatistics(PHASE_A.id());

        assertThat(statistics.gameCount()).isEqualTo(4);
        assertThat(statistics.completionRate()).isEqualTo(0.5);
        assertThat(statistics.teams()).containsExactly(TEAM_A, TEAM_B, TEAM_C);
        assertThat(statistics.teamStats()).containsExactly(
                new TeamStats(TEAM_A, 2, 2, 0, 0, 6, 43, 29, 14),
                new TeamStats(TEAM_B, 1, 0, 0, 1, 0, 15, 25, -10),
                new TeamStats(TEAM_C, 1, 0, 0, 1, 0, 14, 18, -4)
        );
    }

    @Test
    void should_include_games_from_child_phases() {
        Phase childPhase = new Phase("child-phase", "Child phase", PHASE_A.id(), 1, PhaseType.POOL);
        Phase otherPhase = new Phase("other-phase", "Other phase", null, 2, PhaseType.POOL);
        when(gameRepository.findAll()).thenReturn(List.of(
                gameBuilder().id("parent-game").phasePath(List.of(PHASE_A)).status(GameStatus.COMPLETED).build(),
                gameBuilder().id("child-game").phasePath(List.of(PHASE_A, childPhase)).status(GameStatus.SCHEDULED).build(),
                gameBuilder().id("other-game").phasePath(List.of(otherPhase)).status(GameStatus.COMPLETED).build()
        ));

        PhaseStatistics statistics = phaseStatisticsService.getPhaseStatistics(PHASE_A.id());

        assertThat(statistics.gameCount()).isEqualTo(2);
        assertThat(statistics.completionRate()).isEqualTo(0.5);
        assertThat(statistics.teams()).containsExactly(TEAM_A, TEAM_B);
        assertThat(statistics.teamStats()).containsExactly(new TeamStats(TEAM_A, 0, 0, 0, 0, 0, 0, 0, 0),
                new TeamStats(TEAM_B, 0, 0, 0, 0, 0, 0, 0, 0));
    }

    @Test
    void should_return_zero_completion_rate_when_phase_has_no_game() {
        when(gameRepository.findAll()).thenReturn(List.of());

        PhaseStatistics statistics = phaseStatisticsService.getPhaseStatistics(PHASE_A.id());

        assertThat(statistics.gameCount()).isZero();
        assertThat(statistics.completionRate()).isZero();
        assertThat(statistics.teams()).isEmpty();
        assertThat(statistics.teamStats()).isEmpty();
    }
}
