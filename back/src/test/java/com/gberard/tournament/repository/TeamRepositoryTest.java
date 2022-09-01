package com.gberard.tournament.repository;

import com.gberard.tournament.data.Team;
import com.google.api.client.testing.http.MockLowLevelHttpRequest;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static com.gberard.tournament.data._TestUtils.*;
import static com.gberard.tournament.repository.SheetRepositoryTest.MockedApiCall.mockedApiCall;
import static com.gberard.tournament.repository.TeamRepository.RANGE;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeamRepositoryTest extends SheetRepositoryTest {

    public static final String URL_VALUES_GET = API_SHEETS_VALUES + "/" + RANGE;

    public static final List<Object> RAW_TEAM_1 = rawData("teamA", "TeamA");
    public static final List<Object> RAW_TEAM_2 = rawData("teamB", "TeamB");

    @Spy
    @InjectMocks
    private TeamRepository teamRepository = new TeamRepository();

    @Nested
    @DisplayName("create()")
    class Create {

        private List<MockLowLevelHttpRequest> requests;

        @BeforeEach
        void prepare_http_transport() throws Exception {
            requests = mockHttpTransport();
        }

        @Test
        void shoud_call_spreadsheet_url() throws Exception {
            // When
            teamRepository.create(teamA);

            // Then
            assertThat(requests).map(MockLowLevelHttpRequest::getUrl).first()
                    .isEqualTo(URL_VALUES_GET + ":append?valueInputOption=USER_ENTERED");
        }

        @Test
        void shoud_use_toRawData_mapper() throws Exception {
            // When
            teamRepository.create(teamA);

            // Then
            verify(teamRepository, times(1)).toRawData(eq(teamA));
        }

        @Test
        void shoud_send_serialized_team() throws Exception {
            // When
            teamRepository.create(teamA);

            // Then
            assertThat(requests.get(0).getContentAsString())
                    .contains("{\"values\":[[\"teamA\",\"TeamA\"]]}");
        }

    }

    @Nested
    @DisplayName("readAll()")
    class ReadAll {

        @Test
        void shoud_call_spreadsheet_url() throws Exception {
            // Given
            var requests = mockHttpTransport();

            // When
            teamRepository.readAll();

            // Then
            assertThat(requests).map(MockLowLevelHttpRequest::getUrl).element(0).isEqualTo(URL_VALUES_GET);
        }

        @Test
        void shoud_use_fromRawData_mapper() throws Exception {
            // Given
            mockHttpTransport(mockedApiCall(GET, URL_VALUES_GET, buildValuesGetResponse(RAW_TEAM_1, RAW_TEAM_2)));

            // When
            teamRepository.readAll();

            // Then
            verify(teamRepository, times(1)).fromRawData(eq(RAW_TEAM_1));
            verify(teamRepository, times(1)).fromRawData(eq(RAW_TEAM_2));
        }

        @Test
        void shoud_return_deserialized_team() throws Exception {
            // Given
            mockHttpTransport(mockedApiCall(GET, URL_VALUES_GET, buildValuesGetResponse(RAW_TEAM_1, RAW_TEAM_2)));

            // When
            List<Team> teams = teamRepository.readAll();

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
        void should_return_team_if_present() throws Exception {
            // Given
            mockHttpTransport(mockedApiCall(GET, URL_VALUES_GET, buildValuesGetResponse(RAW_TEAM_1, RAW_TEAM_2)));

            // When
            Optional<Team> team = teamRepository.search("teamB");

            // Then
            assertThat(team.isPresent()).isTrue();
            assertThat(team.get().id()).isEqualTo("teamB");
            assertThat(team.get().name()).isEqualTo("TeamB");
        }

        @Test
        void should_return_empty_if_absent() throws Exception {
            // Given
            mockHttpTransport(mockedApiCall(GET, URL_VALUES_GET, buildValuesGetResponse(RAW_TEAM_1)));

            // When
            Optional<Team> team = teamRepository.search("team2");

            // Then
            assertThat(team.isPresent()).isFalse();
        }
    }

    @Nested
    @DisplayName("delete()")
    class Delete {

        private List<MockLowLevelHttpRequest> requests;

        @BeforeEach
        void prepare_http_transport() throws Exception {
            requests = mockHttpTransport(
                    mockedApiCall(PUT, API_SHEETS_VALUES + "/Teams!L1" + "?valueInputOption=USER_ENTERED", "{}"),
                    mockedApiCall(GET, API_SHEETS_VALUES + "/Teams!L1", buildValuesGetResponse(List.of(10))),
                    mockedApiCall(POST, API_SHEETS_VALUES + ":batchClearByDataFilter ", "{}"),
                    mockedApiCall(GET, API_SHEETS + "?ranges=Teams", buildSheetIdResponse()),
                    mockedApiCall(POST, API_SHEETS + ":batchUpdate", "{}")
            );
        }

        @Test
        void shoud_call_spreadsheet_url() {
            // When
            teamRepository.delete(teamA);

            // Then
            assertThat(requests).map(MockLowLevelHttpRequest::getUrl)
                    .containsExactlyInAnyOrder(
                            API_SHEETS_VALUES + "/Teams!L1" + "?valueInputOption=USER_ENTERED",
                            API_SHEETS_VALUES + "/Teams!L1",
                            API_SHEETS_VALUES + ":batchClearByDataFilter",
                            API_SHEETS + "?ranges=Teams",
                            API_SHEETS + ":batchUpdate"
                    );
        }

        @Test
        void shoud_delete_row_with_use_given_index() throws IOException {
            // When
            teamRepository.delete(teamA);

            // Then
            verify(teamRepository, times(1)).deleteRaws(eq(10), eq(1));
        }

        @Test
        void shoud_delete_search_for_element() throws IOException {
            // When
            teamRepository.delete(teamA);

            // Then
            verify(teamRepository, times(1)).searchElementLine(eq(teamA));
        }

    }

    @Nested
    @DisplayName("deleteAll()")
    class DeleteAll {

        private List<MockLowLevelHttpRequest> requests;

        @BeforeEach
        void prepare_http_transport() throws Exception {
            requests = mockHttpTransport(
                    mockedApiCall(GET, API_SHEETS + "?ranges=Teams", buildSheetIdResponse()),
                    mockedApiCall(POST, API_SHEETS + ":batchUpdate", "{}")
            );
        }

        @Test
        void shoud_call_spreadsheet_url() {
            // When
            teamRepository.deleteAll();

            // Then
            assertThat(requests).map(MockLowLevelHttpRequest::getUrl)
                    .containsExactlyInAnyOrder(API_SHEETS + "?ranges=Teams", API_SHEETS + ":batchUpdate");
        }

        @Test
        void shoud_delete_row_with_use_given_sheetId() throws IOException {
            // When
            teamRepository.deleteAll();

            // Then
            assertThat(requests.get(1).getContentAsString()).contains("\"sheetId\":"+SHEET_ID);
        }

        @Test
        void shoud_delete_row_with_use_given_index() throws IOException {
            // When
            teamRepository.deleteAll();

            // Then
            verify(teamRepository, times(1)).deleteRaws(eq(1));
        }

    }

}