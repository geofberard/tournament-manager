package com.gberard.tournament.repository;

import com.gberard.tournament.data.Team;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static com.gberard.tournament.data._TestUtils.rawData;
import static com.gberard.tournament.data._TestUtils.teamA;
import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class TeamRepositoryMapperTest {

    @Spy
    @InjectMocks
    private TeamRepository teamService = new TeamRepository();

    @Nested
    @DisplayName("fromRawData()")
    class FromRawData {

        @Test
        void should_map_to_team() {
            // Given
            List<Object> RAW_TEAM_1 = rawData("team1", "Team1");

            // When
            Team team = teamService.fromRawData(RAW_TEAM_1);

            // Then
            assertThat(team.id()).isEqualTo("team1");
            assertThat(team.name()).isEqualTo("Team1");
        }

    }

    @Nested
    @DisplayName("toRawData()")
    class ToRawData {

        @Test
        void should_map_to_team() {
            // When
            List<Object> objects = teamService.toRawData(teamA);

            // Then
            assertThat(objects).containsExactlyInAnyOrder(teamA.id(),teamA.name());
        }

    }

}