package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.scheduling.TeamPair;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.gberard.tournament.TestUtils.TEAM_A;
import static com.gberard.tournament.TestUtils.TEAM_B;
import static com.gberard.tournament.TestUtils.TEAM_C;
import static com.gberard.tournament.TestUtils.TEAM_D;
import static com.gberard.tournament.TestUtils.TEAM_E;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class RoundRobinTeamPairGeneratorTest {

    private final RoundRobinTeamPairGenerator generator = new RoundRobinTeamPairGenerator();

    @Test
    void shouldGenerateEveryPairExactlyOnceForAnEvenNumberOfTeams() {
        // GIVEN
        List<Team> teams = List.of(TEAM_A, TEAM_B, TEAM_C, TEAM_D);

        // WHEN
        List<TeamPair> teamPairs = generator.generate(teams);

        // THEN
        assertThat(teamPairs).hasSize(6);
        assertThat(pairIds(teamPairs)).containsExactlyInAnyOrder(
                "teamA-teamB",
                "teamA-teamC",
                "teamA-teamD",
                "teamB-teamC",
                "teamB-teamD",
                "teamC-teamD"
        );
    }

    @Test
    void shouldGenerateEveryPairExactlyOnceForAnOddNumberOfTeams() {
        // GIVEN
        List<Team> teams = List.of(TEAM_A, TEAM_B, TEAM_C, TEAM_D, TEAM_E);

        // WHEN
        List<TeamPair> teamPairs = generator.generate(teams);

        // THEN
        assertThat(teamPairs).hasSize(10);
        assertThat(teamPairs)
                .flatExtracting(TeamPair::teams)
                .filteredOn(TEAM_A::equals)
                .hasSize(4);
        assertThat(pairIds(teamPairs)).hasSize(10);
    }

    @Test
    void shouldGenerateOneMatchupForTwoTeams() {
        // GIVEN / WHEN
        List<TeamPair> teamPairs = generator.generate(List.of(TEAM_A, TEAM_B));

        // THEN
        assertThat(teamPairs)
                .singleElement()
                .extracting(TeamPair::teams)
                .isEqualTo(List.of(TEAM_A, TEAM_B));
    }

    @Test
    void shouldRejectLessThanTwoTeams() {
        // WHEN / THEN
        assertThatThrownBy(() -> generator.generate(List.of(TEAM_A)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("At least two teams are required");
    }

    @Test
    void shouldRejectDuplicateTeams() {
        // WHEN / THEN
        assertThatThrownBy(() -> generator.generate(List.of(TEAM_A, TEAM_B, TEAM_A)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("Teams must be unique");
    }

    private Set<String> pairIds(List<TeamPair> teamPairs) {
        return teamPairs.stream()
                .map(teamPair -> teamPair.teams().stream()
                        .map(Team::id)
                        .sorted()
                        .collect(Collectors.joining("-")))
                .collect(Collectors.toSet());
    }
}
