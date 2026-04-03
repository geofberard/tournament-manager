package com.gberard.tournament.domain.model.stats;

import org.junit.jupiter.api.Test;

import static com.gberard.tournament.TestUtils.TEAM_A;
import static com.gberard.tournament.TestUtils.TEAM_B;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class TeamStatsAccumulatorTest {

    @Test
    void should_have_no_initial_count() {
        TeamStats stats = new TeamStatsAccumulator(TEAM_A).create();

        assertThat(stats.played()).isEqualTo(0);
        assertThat(stats.won()).isEqualTo(0);
        assertThat(stats.drawn()).isEqualTo(0);
        assertThat(stats.lost()).isEqualTo(0);
        assertThat(stats.score()).isEqualTo(0);
        assertThat(stats.pointsFor()).isEqualTo(0);
        assertThat(stats.pointsAgainst()).isEqualTo(0);
        assertThat(stats.pointsDiff()).isEqualTo(0);
    }

    @Test
    void should_increment_counter() {
        TeamStats stats = new TeamStatsAccumulator(TEAM_A)
                .addPlayed(1)
                .addWon(2)
                .addDrawn(3)
                .addLost(4)
                .addScore(5)
                .addPointsFor(6)
                .addPointsAgainst(7)
                .addPointsDiff(8)
                .create();

        assertThat(stats.played()).isEqualTo(1);
        assertThat(stats.won()).isEqualTo(2);
        assertThat(stats.drawn()).isEqualTo(3);
        assertThat(stats.lost()).isEqualTo(4);
        assertThat(stats.score()).isEqualTo(5);
        assertThat(stats.pointsFor()).isEqualTo(6);
        assertThat(stats.pointsAgainst()).isEqualTo(7);
        assertThat(stats.pointsDiff()).isEqualTo(8);
    }

    @Test
    void should_manage_merge() {
        TeamStatsAccumulator accumulator1 = new TeamStatsAccumulator(TEAM_A)
                .addPlayed(1)
                .addWon(2)
                .addDrawn(3)
                .addLost(4)
                .addScore(5)
                .addPointsFor(6)
                .addPointsAgainst(7)
                .addPointsDiff(8);

        TeamStatsAccumulator accumulator2 = new TeamStatsAccumulator(TEAM_A)
                .addPlayed(1)
                .addWon(2)
                .addDrawn(3)
                .addLost(4)
                .addScore(5)
                .addPointsFor(6)
                .addPointsAgainst(7)
                .addPointsDiff(8);

        TeamStats stats = TeamStatsAccumulator.merge(accumulator1, accumulator2).create();

        assertThat(stats.played()).isEqualTo(2);
        assertThat(stats.won()).isEqualTo(4);
        assertThat(stats.drawn()).isEqualTo(6);
        assertThat(stats.lost()).isEqualTo(8);
        assertThat(stats.score()).isEqualTo(10);
        assertThat(stats.pointsFor()).isEqualTo(12);
        assertThat(stats.pointsAgainst()).isEqualTo(14);
        assertThat(stats.pointsDiff()).isEqualTo(16);
    }

    @Test
    void should_throw_error_when_merging_different_teams() {
        TeamStatsAccumulator accumulator1 = new TeamStatsAccumulator(TEAM_A);
        TeamStatsAccumulator accumulator2 = new TeamStatsAccumulator(TEAM_B);

        assertThrows(IllegalStateException.class, () -> TeamStatsAccumulator.merge(accumulator1, accumulator2));
    }
}
