package com.gberard.tournament.repository;

import com.gberard.tournament.data.Team;
import com.google.api.client.testing.http.MockHttpTransport;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static com.gberard.tournament.data._TestUtils.*;
import static com.gberard.tournament.repository.TeamRepository.RANGE;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeamRepositoryTest extends SheetRepositoryTest {

    public static final List<Object> RAW_TEAM_1 = rawData("teamA", "TeamA");
    public static final List<Object> RAW_TEAM_2 = rawData("teamB", "TeamB");

    @Spy
    @InjectMocks
    private TeamRepository teamService = new TeamRepository();

    @Nested
    @DisplayName("create()")
    class Create {

        @Test
        void shoud_call_spreadsheet_url() throws Exception{
            // Given
            MockHttpTransport httpTransport = mockServerResponse();

            // When
            teamService.create(teamA);

            // Then
            assertThat(httpTransport.getLowLevelHttpRequest().getUrl())
                    .isEqualTo(TARGET_URL + "/" + RANGE +  ":append?valueInputOption=USER_ENTERED");
        }

        @Test
        void shoud_use_toRawData_mapper() throws Exception{
            // Given
            mockServerResponse();

            // When
            teamService.create(teamA);

            // Then
            verify(teamService,times(1)).toRawData(eq(teamA));
        }

        @Test
        void shoud_send_serialized_team() throws Exception{
            // Given
            MockHttpTransport httpTransport = mockServerResponse();

            // When
            teamService.create(teamA);

            // Then
            assertThat(httpTransport.getLowLevelHttpRequest().getContentAsString())
                    .contains("{\"values\":[[\"teamA\",\"TeamA\"]]}");
        }

    }

    @Nested
    @DisplayName("readAll()")
    class ReadAll {

        @Test
        void shoud_call_spreadsheet_url() throws Exception {
            // Given
            MockHttpTransport httpTransport = mockServerResponse();

            // When
            teamService.readAll();

            // Then
            assertThat(httpTransport.getLowLevelHttpRequest().getUrl()).isEqualTo(TARGET_URL + "/" + RANGE);
        }

        @Test
        void shoud_use_fromRawData_mapper() throws Exception{
            // Given
            mockServerResponse(getGetResponse(List.of(RAW_TEAM_1, RAW_TEAM_2)));

            // When
            teamService.readAll();

            // Then
            verify(teamService,times(1)).fromRawData(eq(RAW_TEAM_1));
            verify(teamService,times(1)).fromRawData(eq(RAW_TEAM_2));
        }

        @Test
        void shoud_return_deserialized_team() throws Exception{
            // Given
            mockServerResponse(getGetResponse(List.of(RAW_TEAM_1, RAW_TEAM_2)));

            // When
            List<Team> teams = teamService.readAll();

            // Then
            assertThat(teams).hasSize(2);
            assertThat(teams.get(0)).isEqualTo(teamA);
            assertThat(teams.get(1)).isEqualTo(teamB);
        }

    }

    @Nested
    @DisplayName("search()")
    class Search {

        @Test
        void should_return_team_if_present() throws Exception{
            // Given
            mockServerResponse(getGetResponse(List.of(RAW_TEAM_1, RAW_TEAM_2)));

            // When
            Optional<Team> team = teamService.search("teamB");

            // Then
            assertThat(team.isPresent()).isTrue();
            assertThat(team.get().id()).isEqualTo("teamB");
            assertThat(team.get().name()).isEqualTo("TeamB");
        }

        @Test
        void should_return_empty_if_absent()  throws Exception{
            // Given
            mockServerResponse(getGetResponse(List.of(RAW_TEAM_1)));

            // When
            Optional<Team> team = teamService.search("team2");

            // Then
            assertThat(team.isPresent()).isFalse();
        }
    }

    @Nested
    @DisplayName("DeleteAll()")
    class DeleteAll {

        @Test
        void shoud_call_spreadsheet_url() throws Exception {
            // Given
            MockHttpTransport httpTransport = mockServerResponse();

            // When
            teamService.deleteAll();

            // Then
            assertThat(httpTransport.getLowLevelHttpRequest().getUrl())
                    .isEqualTo(TARGET_URL + ":batchClearByDataFilter");
        }

    }

}