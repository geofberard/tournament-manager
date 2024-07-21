package com.gberard.tournament.domain.model.stats;

import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.stats.ContestantStats;
import com.gberard.tournament.domain.model.stats.ContestantStatsAccumulator;
import org.junit.jupiter.api.Test;

import java.util.List;

import static com.gberard.tournament.TestUtils.TEAM_A;
import static com.gberard.tournament.TestUtils.TEAM_B;
import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

class ContestantStatsAccumulatorTest {

    @Test
    void should_have_no_initial_count() {
        // When
        ContestantStats stats = new ContestantStatsAccumulator(TEAM_A).create();

        // Then
        assertThat(stats.played()).as("played").isEqualTo(0);
        assertThat(stats.won()).as("won").isEqualTo(0);
        assertThat(stats.drawn()).as("drawn").isEqualTo(0);
        assertThat(stats.lost()).as("lost").isEqualTo(0);
        assertThat(stats.score()).as("score").isEqualTo(0);
        assertThat(stats.pointsFor()).as("pointsFor").isEqualTo(0);
        assertThat(stats.pointsAgainst()).as("pointsAgainst").isEqualTo(0);
        assertThat(stats.pointsDiff()).as("pointsDiff").isEqualTo(0);
    }

    @Test
    void should_increment_counter() {
        // When
        ContestantStats stats = new ContestantStatsAccumulator(TEAM_A)
                .addPlayed(1)
                .addWon(2)
                .addDrawn(3)
                .addLost(4)
                .addScore(5)
                .addPointsFor(6)
                .addPointsAgainst(7)
                .addPointsDiff(8)
                .create();

        // Then
        assertThat(stats.played()).as("played").isEqualTo(1);
        assertThat(stats.won()).as("won").isEqualTo(2);
        assertThat(stats.drawn()).as("drawn").isEqualTo(3);
        assertThat(stats.lost()).as("lost").isEqualTo(4);
        assertThat(stats.score()).as("score").isEqualTo(5);
        assertThat(stats.pointsFor()).as("pointsFor").isEqualTo(6);
        assertThat(stats.pointsAgainst()).as("pointsAgainst").isEqualTo(7);
        assertThat(stats.pointsDiff()).as("pointsDiff").isEqualTo(8);
    }

    @Test
    void should_manage_multiple_increment() {
        // When
        ContestantStats stats = new ContestantStatsAccumulator(TEAM_A)
                .addPlayed(1)
                .addWon(2)
                .addDrawn(3)
                .addLost(4)
                .addScore(5)
                .addPointsFor(6)
                .addPointsAgainst(7)
                .addPointsDiff(8)
                .addPlayed(1)
                .addWon(2)
                .addDrawn(3)
                .addLost(4)
                .addScore(5)
                .addPointsFor(6)
                .addPointsAgainst(7)
                .addPointsDiff(8)
                .create();

        // Then
        assertThat(stats.played()).as("played").isEqualTo(2);
        assertThat(stats.won()).as("won").isEqualTo(4);
        assertThat(stats.drawn()).as("drawn").isEqualTo(6);
        assertThat(stats.lost()).as("lost").isEqualTo(8);
        assertThat(stats.score()).as("score").isEqualTo(10);
        assertThat(stats.pointsFor()).as("pointsFor").isEqualTo(12);
        assertThat(stats.pointsAgainst()).as("pointsAgainst").isEqualTo(14);
        assertThat(stats.pointsDiff()).as("pointsDiff").isEqualTo(16);
    }

    @Test
    void should_manage_merge() {
        // Given
        ContestantStatsAccumulator accumulator1 = new ContestantStatsAccumulator(TEAM_A)
                .addPlayed(1)
                .addWon(2)
                .addDrawn(3)
                .addLost(4)
                .addScore(5)
                .addPointsFor(6)
                .addPointsAgainst(7)
                .addPointsDiff(8);

        ContestantStatsAccumulator accumulator2 = new ContestantStatsAccumulator(TEAM_A)
                .addPlayed(1)
                .addWon(2)
                .addDrawn(3)
                .addLost(4)
                .addScore(5)
                .addPointsFor(6)
                .addPointsAgainst(7)
                .addPointsDiff(8);

        // When
        ContestantStats stats = ContestantStatsAccumulator.merge(accumulator1, accumulator2).create();

        // Then
        assertThat(stats.played()).as("played").isEqualTo(2);
        assertThat(stats.won()).as("won").isEqualTo(4);
        assertThat(stats.drawn()).as("drawn").isEqualTo(6);
        assertThat(stats.lost()).as("lost").isEqualTo(8);
        assertThat(stats.score()).as("score").isEqualTo(10);
        assertThat(stats.pointsFor()).as("pointsFor").isEqualTo(12);
        assertThat(stats.pointsAgainst()).as("pointsAgainst").isEqualTo(14);
        assertThat(stats.pointsDiff()).as("pointsDiff").isEqualTo(16);
    }

    @Test
    void should_thow_error_when_mergind_different_teams() {
        // Given
        ContestantStatsAccumulator accumulator1 = new ContestantStatsAccumulator(TEAM_A);
        ContestantStatsAccumulator accumulator2 = new ContestantStatsAccumulator(TEAM_B);

        // When
        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> ContestantStatsAccumulator.merge(accumulator1, accumulator2),
                "Expected merge() to throw, but it didn't"
        );
    }
}
