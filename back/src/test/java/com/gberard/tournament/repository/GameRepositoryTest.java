package com.gberard.tournament.repository;

import com.gberard.tournament.data.Game;
import com.gberard.tournament.data.Team;
import com.google.api.client.testing.http.MockLowLevelHttpRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static com.gberard.tournament.data._TestUtils.*;
import static com.gberard.tournament.repository.GameRepository.RANGE;
import static com.gberard.tournament.repository.SheetRepositoryTest.MockedApiCall.mockedApiCall;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class GameRepositoryTest extends SheetRepositoryTest {

    public static final String URL_VALUES = API_SHEETS_VALUES + "/" + RANGE;

    private static final List<Object> RAW_GAME_1 =
            rawData("game1", "29/08/2022", "10:30", "court", "teamA", "teamB", "teamC", "25", "14");
    private static final List<Object> RAW_GAME_2 =
            rawData("game2", "29/08/2022", "11:30", "court", "teamC", "teamB");
    private static final List<Object> RAW_GAME_3 =
            rawData("game3", "29/08/2022", "13:30", "court", "teamA", "teamC", "", "", "");
    private static final List<Object> RAW_GAME_4 =
            rawData("game4", "29/08/2022", "14:30", "court", "teamA", "teamB", "");


    @Spy
    @InjectMocks
    private GameRepository gameRepository;

    @Mock
    private TeamRepository teamService;

    private void mockTeamService(Team... teams) {
        if (teams.length == 0) {
            when(teamService.search(any())).thenReturn(Optional.of(teamA));
        } else {
            Arrays.stream(teams)
                    .forEach(team -> when(teamService.search(eq(team.id()))).thenReturn(Optional.of(team)));
        }
    }

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
            gameRepository.create(game1);

            // Then
            assertThat(requests).map(MockLowLevelHttpRequest::getUrl).first()
                    .isEqualTo(URL_VALUES + ":append?valueInputOption=USER_ENTERED");
        }

        @Test
        void shoud_use_toRawData_mapper() throws Exception {
            // When
            gameRepository.create(game1);

            // Then
            verify(gameRepository, times(1)).toRawData(eq(game1));
        }

        @Test
        void shoud_send_serialized_completed_game() throws Exception {
            // When
            gameRepository.create(game1);

            // Then
            assertThat(requests.get(0).getContentAsString())
                    .contains("{\"values\":[[\"game1\",\"29/08/2022\",\"10:30\",\"court\",\"teamA\",\"teamB\"," +
                            "\"teamC\",\"25\",\"14\"]]}");
        }

        @Test
        void shoud_send_serialized_partial_game() throws Exception {
            // When
            gameRepository.create(game2);

            // Then
            assertThat(requests.get(0).getContentAsString())
                    .contains("{\"values\":[[\"game2\",\"29/08/2022\",\"11:30\",\"court\",\"teamC\",\"teamB\"," +
                            "\"\",\"\",\"\"]]}");
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
            gameRepository.readAll();

            // Then
            assertThat(requests).map(MockLowLevelHttpRequest::getUrl).element(0).isEqualTo(URL_VALUES);
        }

        @Test
        void shoud_use_fromRawData_mapper() throws Exception {
            // Given
            mockHttpTransport(mockedApiCall(GET, URL_VALUES, buildValuesGetResponse(RAW_GAME_1, RAW_GAME_2)));
            mockTeamService(teamA, teamB, teamC);

            // When
            gameRepository.readAll();

            // Then
            verify(gameRepository, times(1)).fromRawData(eq(RAW_GAME_1));
            verify(gameRepository, times(1)).fromRawData(eq(RAW_GAME_2));
        }

        @Test
        void shoud_return_deserialized_game() throws Exception {
            // Given
            mockHttpTransport(mockedApiCall(GET, URL_VALUES, buildValuesGetResponse(RAW_GAME_1, RAW_GAME_2)));
            mockTeamService(teamA, teamB, teamC);

            // When
            List<Game> teams = gameRepository.readAll();

            // Then
            assertThat(teams).hasSize(2);
            assertThat(teams.get(0)).isEqualTo(game1);
            assertThat(teams.get(1)).isEqualTo(game2);
        }

    }

    @Nested
    @DisplayName("searchFor()")
    class SearchFor {

        @Test
        void should_filter_properly() throws Exception {
            // Given
            mockHttpTransport(
                    mockedApiCall(GET, URL_VALUES, buildValuesGetResponse(RAW_GAME_1, RAW_GAME_3, RAW_GAME_4))
            );
            mockTeamService(teamA, teamB, teamC);

            // When
            List<Game> gamesFor = gameRepository.searchFor(teamB);

            // Then
            assertThat(gamesFor).map(Game::id).containsExactly("game1", "game4");
        }

    }

    @Nested
    @DisplayName("delete()")
    class Delete {

        private List<MockLowLevelHttpRequest> requests;

        @BeforeEach
        void prepare_http_transport() throws Exception {
            requests = mockHttpTransport(
                    mockedApiCall(PUT, API_SHEETS_VALUES + "/Games!L1" + "?valueInputOption=USER_ENTERED", "{}"),
                    mockedApiCall(GET, API_SHEETS_VALUES + "/Games!L1", buildValuesGetResponse(List.of(10))),
                    mockedApiCall(POST, API_SHEETS_VALUES + ":batchClearByDataFilter ", "{}"),
                    mockedApiCall(GET, API_SHEETS + "?ranges=Games", buildSheetIdResponse()),
                    mockedApiCall(POST, API_SHEETS + ":batchUpdate", "{}")
            );
        }

        @Test
        void shoud_call_spreadsheet_url() {
            // When
            gameRepository.delete(game1);

            // Then
            assertThat(requests).map(MockLowLevelHttpRequest::getUrl)
                    .containsExactlyInAnyOrder(
                            API_SHEETS_VALUES + "/Games!L1" + "?valueInputOption=USER_ENTERED",
                            API_SHEETS_VALUES + "/Games!L1",
                            API_SHEETS_VALUES + ":batchClearByDataFilter",
                            API_SHEETS + "?ranges=Games",
                            API_SHEETS + ":batchUpdate"
                    );
        }

        @Test
        void shoud_delete_row_with_use_given_index() throws IOException {
            // When
            gameRepository.delete(game1);

            // Then
            verify(gameRepository, times(1)).deleteRaws(eq(10), eq(1));
        }

        @Test
        void shoud_delete_search_for_element() throws IOException {
            // When
            gameRepository.delete(game1);

            // Then
            verify(gameRepository, times(1)).searchElementLine(eq(game1));
        }

    }

    @Nested
    @DisplayName("deleteAll()")
    class DeleteAll {

        private List<MockLowLevelHttpRequest> requests;

        @BeforeEach
        void prepare_http_transport() throws Exception {
            requests = mockHttpTransport(
                    mockedApiCall(GET, API_SHEETS + "?ranges=Games", buildSheetIdResponse()),
                    mockedApiCall(POST, API_SHEETS + ":batchUpdate", "{}")
            );
        }

        @Test
        void shoud_call_spreadsheet_url() {
            // When
            gameRepository.deleteAll();

            // Then
            assertThat(requests).map(MockLowLevelHttpRequest::getUrl)
                    .containsExactlyInAnyOrder(API_SHEETS + "?ranges=Games", API_SHEETS + ":batchUpdate");
        }

        @Test
        void shoud_delete_row_with_use_given_sheetId() throws IOException {
            // When
            gameRepository.deleteAll();

            // Then
            assertThat(requests.get(1).getContentAsString()).contains("\"sheetId\":"+SHEET_ID);
        }

        @Test
        void shoud_delete_row_with_use_given_index() throws IOException {
            // When
            gameRepository.deleteAll();

            // Then
            verify(gameRepository, times(1)).deleteRaws(eq(1));
        }

    }

}