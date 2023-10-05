package com.gberard.tournament.adapter.service;

import com.gberard.tournament.application.config.SpreadsheetConfig;
import com.google.api.client.http.LowLevelHttpRequest;
import com.google.api.client.json.Json;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.testing.http.MockHttpTransport;
import com.google.api.client.testing.http.MockLowLevelHttpRequest;
import com.google.api.client.testing.http.MockLowLevelHttpResponse;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.gson.Gson;
import lombok.extern.slf4j.Slf4j;
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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.OptionalInt;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@Slf4j
class SpreadsheetCRUDServiceTest {

    protected static final String GET = "GET";
    protected static final String POST = "POST";
    protected static final String PUT = "POST";

    protected static final String SPREADSHEET_ID = "mySpreadsheetId";
    protected static final int SHEET_ID = 29694857;
    protected static final String SHEET_NAME = "mySheetName";
    protected static final String RANGE = SHEET_NAME + "!myRange";

    protected static final String API_SHEETS = "https://sheets.googleapis.com/v4/spreadsheets/" + SPREADSHEET_ID;
    protected static final String API_SHEETS_VALUES = API_SHEETS + "/values";
    protected static final String API_SHEETS_VALUES_RANGE = API_SHEETS_VALUES + "/" + RANGE;
    protected static final String API_SHEETS_SEARCH_RANGE = API_SHEETS_VALUES + "/" + SHEET_NAME + "!" + SpreadsheetCRUDService.SEARCH_CELL;

    protected List<Object> DATA_ROW_1 = List.of(List.of("A", "B", "C", "D"));
    protected List<Object> DATA_ROW_2 = List.of(List.of("E", "F", "G"));
    protected List<Object> DATA_ROW_3 = List.of(List.of("H", "", "I", "J"));

    protected List<List<Object>> MOCKED_DATE = List.of(DATA_ROW_1, DATA_ROW_2, DATA_ROW_3);

    @Spy
    @InjectMocks
    private SpreadsheetCRUDService spreadsheetCRUDService;

    @Mock
    private GoogleApiService googleApiService;

    @Mock
    private SpreadsheetConfig spreadsheetConfig;

    public static MockedApiCall mockedApiCall(String method, String url, String response) {
        return new MockedApiCall(method, url, response);
    }

    @BeforeEach
    void prepare_google_api() throws IOException {
        GoogleCredentials googleCredentials = GoogleCredentials.newBuilder()
                .setAccessToken(mock(AccessToken.class))
                .build();

        when(googleApiService.getSACredentials()).thenReturn(new HttpCredentialsAdapter(googleCredentials));
        when(googleApiService.getJsonFactory()).thenReturn(GsonFactory.getDefaultInstance());
        when(spreadsheetConfig.getId()).thenReturn(SPREADSHEET_ID);
    }

    // Utils

    protected List<MockLowLevelHttpRequest> mockHttpTransport(MockedApiCall... mockedApiCalls) throws Exception {
        List<MockLowLevelHttpRequest> requests = new ArrayList<>();

        MockHttpTransport mockHttpTransport = new MockHttpTransport() {

            @Override
            public LowLevelHttpRequest buildRequest(String method, String url) throws IOException {
                String responseContent = Arrays.stream(mockedApiCalls)
                        .filter(apiCall -> apiCall.method.equals(method))
                        .filter(apiCall -> apiCall.url.equals(url))
                        .map(MockedApiCall::response)
                        .findFirst()
                        .orElse("{}");

                log.info("Managing " + method + " on " + url + " returning " + responseContent);

                MockLowLevelHttpResponse response = new MockLowLevelHttpResponse()
                        .setStatusCode(200)
                        .setContentType(Json.MEDIA_TYPE)
                        .setContent(responseContent);

                MockLowLevelHttpRequest mockLowLevelHttpRequest =
                        new MockLowLevelHttpRequest(url).setResponse(response);

                requests.add(mockLowLevelHttpRequest);

                return mockLowLevelHttpRequest;
            }
        };

        when(googleApiService.getHttpTransport()).thenReturn(mockHttpTransport);

        return requests;
    }

    private String toJson(Object values) {
        return new Gson().toJson(values);
    }

    protected final String respondValues(List<List<Object>> values) {
        String jsonValues = toJson(values);
        return "{\"majorDimension\":\"ROWS\",\"range\":\"Teams!A2:B10\",\"values\":" + jsonValues + "}";
    }

    protected String respondSheetId() {
        return "{\"sheets\":[{\"properties\":" +
                "{\"gridProperties\":{\"columnCount\":27,\"rowCount\":8},\"sheetId\":" + SHEET_ID + "}}]}";
    }


    public record MockedApiCall(String method, String url, String response) {
    }

    // Test Suite

    @Nested
    @DisplayName("appendCells()")
    class AppendCells {

        private List<MockLowLevelHttpRequest> requests;

        @BeforeEach
        public void prepare_http_transport() throws Exception {
            requests = mockHttpTransport();
        }

        @Test
        public void should_call_spreadsheet_url() {
            // When
            spreadsheetCRUDService.appendCells(RANGE, MOCKED_DATE);

            // Then
            assertThat(requests).map(MockLowLevelHttpRequest::getUrl).first()
                    .isEqualTo(API_SHEETS_VALUES_RANGE + ":append?valueInputOption=USER_ENTERED");
        }

        @Test
        public void should_send_serialized_team() throws Exception {
            // When
            spreadsheetCRUDService.appendCells(RANGE, MOCKED_DATE);

            // Then
            assertThat(requests.get(0).getContentAsString())
                    .contains("{\"values\":" + toJson(MOCKED_DATE) + "}");
        }

    }

    @Nested
    @DisplayName("readCells()")
    class ReadCells {

        @Test
        public void should_call_spreadsheet_url() throws Exception {
            // Given
            var requests = mockHttpTransport();

            // When
            spreadsheetCRUDService.readCells(RANGE);

            // Then
            assertThat(requests).map(MockLowLevelHttpRequest::getUrl).element(0)
                    .isEqualTo(API_SHEETS_VALUES_RANGE);
        }

        @Test
        public void should_return_deserialized_data() throws Exception {
            // Given
            mockHttpTransport(mockedApiCall(GET, API_SHEETS_VALUES_RANGE, respondValues(MOCKED_DATE)));

            // When
            List<List<Object>> cells = spreadsheetCRUDService.readCells(RANGE);

            // Then
            assertThat(cells).containsExactly(DATA_ROW_1, DATA_ROW_2, DATA_ROW_3);
        }

    }

    @Nested
    @DisplayName("updateCells()")
    class UpdateCells {

        @Test
        public void should_call_spreadsheet_url() throws Exception {
            // Given
            List<MockLowLevelHttpRequest> requests = mockHttpTransport();

            // When
            spreadsheetCRUDService.updateCells(RANGE, MOCKED_DATE);

            // Then
            assertThat(requests).map(MockLowLevelHttpRequest::getUrl)
                    .containsExactly(API_SHEETS_VALUES_RANGE + "?valueInputOption=USER_ENTERED");
        }

    }

    @Nested
    @DisplayName("deleteCells()")
    class DeleteCells {

        @Test
        public void should_call_spreadsheet_url() throws Exception {
            // Given
            List<MockLowLevelHttpRequest> requests = mockHttpTransport();

            // When
            spreadsheetCRUDService.deleteCells(RANGE);

            // Then
            assertThat(requests).map(MockLowLevelHttpRequest::getUrl)
                    .containsExactly(API_SHEETS_VALUES + ":batchClearByDataFilter");
        }

    }

    @Nested
    @DisplayName("findRowIndex()")
    class FindRowIndex {

        private List<MockLowLevelHttpRequest> requests;

        @BeforeEach
        void prepare_http_transport() throws Exception {
            requests = mockHttpTransport(
                    mockedApiCall(GET, API_SHEETS_SEARCH_RANGE, respondValues(List.of(List.of(10))))
            );
        }

        @Test
        public void should_call_spreadsheet_url() {
            // Given
            String searchedValue = "searchedValue";

            // When
            spreadsheetCRUDService.findRowIndex(RANGE, searchedValue);

            // Then
            assertThat(requests).map(MockLowLevelHttpRequest::getUrl)
                    .containsExactlyInAnyOrder(
                            API_SHEETS_SEARCH_RANGE + "?valueInputOption=USER_ENTERED",
                            API_SHEETS_SEARCH_RANGE,
                            API_SHEETS_VALUES + ":batchClearByDataFilter"
                    );
        }

        @Test
        public void should_return_deserialized_data() throws Exception {
            // Given
            String searchedValue = "searchedValue";

            // When
            OptionalInt rowIndex = spreadsheetCRUDService.findRowIndex(RANGE, searchedValue);

            // Then
            assertThat(rowIndex).isPresent().hasValue(10);
        }

        @Test
        public void should_return_nothing_if_error() throws Exception {
            // Given
            String searchedValue = "searchedValue";
            requests = mockHttpTransport();

            // When
            OptionalInt rowIndex = spreadsheetCRUDService.findRowIndex(RANGE, searchedValue);

            // Then
            assertThat(rowIndex).isEmpty();
        }

    }

    @Nested
    @DisplayName("deleteRaws()")
    class DeleteRows {

        private List<MockLowLevelHttpRequest> requests;

        @BeforeEach
        public void prepare_http_transport() throws Exception {
            requests = mockHttpTransport(mockedApiCall(GET, API_SHEETS + "?ranges=" + SHEET_NAME, respondSheetId()));
        }

        @Test
        public void should_call_spreadsheet_url() {
            // When
            spreadsheetCRUDService.deleteRaws(SHEET_NAME, 8);

            // Then
            assertThat(requests).map(MockLowLevelHttpRequest::getUrl)
                    .containsExactlyInAnyOrder(
                            API_SHEETS + "?ranges=" + SHEET_NAME,
                            API_SHEETS + ":batchUpdate"
                    );
        }

        @Test
        public void should_retrieve_and_use_sheet_id() throws IOException {
            // When
            spreadsheetCRUDService.deleteRaws(SHEET_NAME, 8);

            // Then
            assertThat(requests.get(1).getContentAsString()).contains("\"sheetId\":" + SHEET_ID);
        }

        @Test
        public void should_use_given_indexes_on_call_with_startIndex_only() throws IOException {
            // When
            spreadsheetCRUDService.deleteRaws(SHEET_NAME, 8);

            // Then
            assertThat(requests.get(1).getContentAsString()).contains("\"startIndex\":" + 8);
            assertThat(requests.get(1).getContentAsString()).doesNotContain("\"endIndex\"");
        }

        @Test
        public void should_use_given_indexes_on_bounded_call() throws IOException {
            // When
            spreadsheetCRUDService.deleteRaws(SHEET_NAME, 8, 3);

            // Then
            assertThat(requests.get(1).getContentAsString()).contains("\"startIndex\":" + 8);
            assertThat(requests.get(1).getContentAsString()).contains("\"endIndex\":" + 11);
        }

        @Test
        public void should_succeed_if_request_sheet_is_found() {
            // When
            boolean isSuccess = spreadsheetCRUDService.deleteRaws(SHEET_NAME, 8);

            // Then
            assertThat(isSuccess).isTrue();
        }

        @Test
        public void should_fail_without_sheed_id() throws Exception {
            // Given
            requests = mockHttpTransport();

            // When
            boolean isSuccess = spreadsheetCRUDService.deleteRaws(SHEET_NAME, 8);

            // Then
            assertThat(isSuccess).isFalse();
        }

    }

    @Nested
    @DisplayName("findSheetId()")
    class FindSheetId {

        private List<MockLowLevelHttpRequest> requests;

        @BeforeEach
        public void prepare_http_transport() throws Exception {
            requests = mockHttpTransport(mockedApiCall(GET, API_SHEETS + "?ranges=" + SHEET_NAME, respondSheetId()));
        }

        @Test
        public void should_call_spreadsheet_url() {
            // When
            spreadsheetCRUDService.findSheetId(SHEET_NAME);

            // Then
            assertThat(requests).map(MockLowLevelHttpRequest::getUrl)
                    .containsExactly(API_SHEETS + "?ranges=" + SHEET_NAME);
        }

        @Test
        public void should_return_deserialized_data() {
            // When
            OptionalInt sheetId = spreadsheetCRUDService.findSheetId(SHEET_NAME);

            // Then
            assertThat(sheetId).isPresent().hasValue(SHEET_ID);
        }

    }
}