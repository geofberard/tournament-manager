package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.scheduling.PlannedGame;
import com.gberard.tournament.domain.model.scheduling.TeamPair;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.gberard.tournament.TestUtils.TEAM_A;
import static com.gberard.tournament.TestUtils.TEAM_B;
import static com.gberard.tournament.TestUtils.TEAM_C;
import static com.gberard.tournament.TestUtils.TEAM_D;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class TeamRefereeAllocatorTest {

    private final RoundRobinTeamPairGenerator generator = new RoundRobinTeamPairGenerator();
    private final TeamRefereeAllocator allocator = new TeamRefereeAllocator();

    @Test
    void shouldAssignANonContestantToEveryGame() {
        // GIVEN
        List<Team> teams = List.of(TEAM_A, TEAM_B, TEAM_C, TEAM_D);
        List<TeamPair> teamPairs = generator.generate(teams);
        List<PlannedGame> plannedGames = plan(teamPairs);

        // WHEN
        List<PlannedGame> allocatedGames = allocator.allocate(plannedGames, teams);

        // THEN
        assertThat(allocatedGames).hasSameSizeAs(teamPairs);
        for (int index = 0; index < teamPairs.size(); index++) {
            PlannedGame allocatedGame = allocatedGames.get(index);
            assertThat(allocatedGame.teamPair()).isEqualTo(teamPairs.get(index));
            assertThat(allocatedGame.time()).isEqualTo(plannedGames.get(index).time());
            assertThat(allocatedGame.referee()).isPresent();
            assertThat(teamPairs.get(index).contains(allocatedGame.referee().orElseThrow())).isFalse();
        }
    }

    @Test
    void shouldDistributeAssignmentsFairly() {
        // GIVEN
        List<Team> teams = List.of(TEAM_A, TEAM_B, TEAM_C, TEAM_D);

        // WHEN
        List<PlannedGame> allocatedGames = allocator.allocate(plan(generator.generate(teams)), teams);

        // THEN
        Map<Team, Long> assignmentCounts = allocatedGames.stream()
                .map(game -> game.referee().orElseThrow())
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()));
        assertThat(assignmentCounts).hasSize(4);
        assertThat(assignmentCounts.values()).allMatch(count -> count >= 1 && count <= 2);
    }

    @Test
    void shouldUseTheOnlyAvailableRefereeForThreeTeams() {
        // GIVEN
        List<Team> teams = List.of(TEAM_A, TEAM_B, TEAM_C);
        List<TeamPair> teamPairs = generator.generate(teams);

        // WHEN
        List<PlannedGame> allocatedGames = allocator.allocate(plan(teamPairs), teams);

        // THEN
        for (int index = 0; index < teamPairs.size(); index++) {
            TeamPair teamPair = teamPairs.get(index);
            Team expectedReferee = teams.stream()
                    .filter(team -> !teamPair.contains(team))
                    .findFirst()
                    .orElseThrow();
            assertThat(allocatedGames.get(index).referee()).contains(expectedReferee);
        }
    }

    @Test
    void shouldPreferATeamThatDoesNotPlayTheNextGameWhenCountsAreEqual() {
        // GIVEN
        TeamPair first = new TeamPair(TEAM_A, TEAM_B);
        TeamPair second = new TeamPair(TEAM_A, TEAM_C);
        List<Team> teams = List.of(TEAM_A, TEAM_B, TEAM_C, TEAM_D);

        // WHEN
        List<PlannedGame> allocatedGames = allocator.allocate(plan(List.of(first, second)), teams);

        // THEN
        assertThat(allocatedGames.get(0).referee()).contains(TEAM_D);
    }

    @Test
    void shouldRejectRefereeAllocationForTwoTeams() {
        // GIVEN
        List<Team> teams = List.of(TEAM_A, TEAM_B);

        // WHEN / THEN
        assertThatThrownBy(() -> allocator.allocate(plan(generator.generate(teams)), teams))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessage("At least three teams are required to assign team referees");
    }

    private List<PlannedGame> plan(List<TeamPair> teamPairs) {
        LocalDateTime startTime = LocalDateTime.parse("2026-06-20T09:00:00");
        return java.util.stream.IntStream.range(0, teamPairs.size())
                .mapToObj(index -> new PlannedGame(
                        teamPairs.get(index),
                        startTime.plusMinutes(index * 15L),
                        Optional.empty()
                ))
                .toList();
    }
}
