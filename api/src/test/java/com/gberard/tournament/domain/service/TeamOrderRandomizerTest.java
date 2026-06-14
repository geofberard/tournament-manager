package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.Team;
import org.junit.jupiter.api.Test;

import java.util.List;
import java.util.Random;

import static com.gberard.tournament.TestUtils.TEAM_A;
import static com.gberard.tournament.TestUtils.TEAM_B;
import static com.gberard.tournament.TestUtils.TEAM_C;
import static com.gberard.tournament.TestUtils.TEAM_D;
import static org.assertj.core.api.Assertions.assertThat;

class TeamOrderRandomizerTest {

    @Test
    void shouldShuffleTeamsWithoutModifyingTheInputList() {
        // GIVEN
        List<Team> teams = List.of(TEAM_A, TEAM_B, TEAM_C, TEAM_D);
        TeamOrderRandomizer randomizer = new TeamOrderRandomizer(new Random(42));

        // WHEN
        List<Team> shuffledTeams = randomizer.shuffle(teams);

        // THEN
        assertThat(shuffledTeams).containsExactly(TEAM_D, TEAM_B, TEAM_A, TEAM_C);
        assertThat(shuffledTeams).containsExactlyInAnyOrderElementsOf(teams);
        assertThat(teams).containsExactly(TEAM_A, TEAM_B, TEAM_C, TEAM_D);
    }
}
