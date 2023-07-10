package com.gberard.tournament.data;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.*;
import static org.junit.jupiter.api.Assertions.*;

class TeamStatsAccumulatorTest {

    private TeamV1 team = new TeamV1("teamId","teamName");

    @Test
    void should_have_no_initial_count() {
        // When
        TeamStatsV1 stats = new TeamStatsAccumulator(team).createTeamStatistic();

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
        TeamStatsV1 stats = new TeamStatsAccumulator(team)
                .addPlayed(1)
                .addWon(2)
                .addDrawn(3)
                .addLost(4)
                .addScore(5)
                .addPointsFor(6)
                .addPointsAgainst(7)
                .addPointsDiff(8)
                .createTeamStatistic();

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
        TeamStatsV1 stats = new TeamStatsAccumulator(team)
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
                .createTeamStatistic();

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
        TeamStatsAccumulator accumulator1 = new TeamStatsAccumulator(team)
                .addPlayed(1)
                .addWon(2)
                .addDrawn(3)
                .addLost(4)
                .addScore(5)
                .addPointsFor(6)
                .addPointsAgainst(7)
                .addPointsDiff(8);

        TeamStatsAccumulator accumulator2 = new TeamStatsAccumulator(team)
                .addPlayed(1)
                .addWon(2)
                .addDrawn(3)
                .addLost(4)
                .addScore(5)
                .addPointsFor(6)
                .addPointsAgainst(7)
                .addPointsDiff(8);

        // When
        TeamStatsV1 stats = TeamStatsAccumulator.merge(accumulator1, accumulator2).createTeamStatistic();

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
        TeamStatsAccumulator accumulator1 = new TeamStatsAccumulator(team);
        TeamStatsAccumulator accumulator2 = new TeamStatsAccumulator(new TeamV1("error","error"));

        // When
        IllegalStateException exception = assertThrows(
                IllegalStateException.class,
                () -> TeamStatsAccumulator.merge(accumulator1, accumulator2),
                "Expected merge() to throw, but it didn't"
        );
    }
}