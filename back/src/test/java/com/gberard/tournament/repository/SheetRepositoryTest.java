package com.gberard.tournament.repository;

import com.gberard.tournament.config.SpreadsheetConfig;
import com.gberard.tournament.service.GoogleApiService;
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
import org.mockito.Mock;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@Slf4j
class SheetRepositoryTest {

    protected static final String GET = "GET";
    protected static final String POST = "POST";
    protected static final String PUT = "POST";
    protected static final String SPREADSHEET_ID = "spreadsheetId";
    protected static final int SHEET_ID = 29694857;
    protected static final String API_SHEETS = "https://sheets.googleapis.com/v4/spreadsheets/" + SPREADSHEET_ID;

    protected static final String API_SHEETS_VALUES = API_SHEETS + "/values";

    @Mock
    private GoogleApiService googleApiService;

    @Mock
    private SpreadsheetConfig spreadsheetConfig;

    @BeforeEach
    void prepare_google_api() throws IOException {
        GoogleCredentials googleCredentials = GoogleCredentials.newBuilder()
                .setAccessToken(mock(AccessToken.class))
                .build();

        when(googleApiService.getSACredentials()).thenReturn(new HttpCredentialsAdapter(googleCredentials));
        when(googleApiService.getJsonFactory()).thenReturn(GsonFactory.getDefaultInstance());
        when(spreadsheetConfig.getId()).thenReturn(SPREADSHEET_ID);
    }

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

    public record MockedApiCall(String method, String url, String response) {
        public static MockedApiCall mockedApiCall(String method, String url, String response) {
            return new MockedApiCall(method, url, response);
        }
    }

    @SafeVarargs
    protected final String buildValuesGetResponse(List<Object>... values) {
        String jsonValues = new Gson().toJson(Arrays.asList(values));
        return "{\"majorDimension\":\"ROWS\",\"range\":\"Teams!A2:B10\",\"values\":" + jsonValues + "}";
    }

    protected String buildSheetIdResponse() {
        return "{\"sheets\":[{\"properties\":" +
                "{\"gridProperties\":{\"columnCount\":27,\"rowCount\":8},\"sheetId\":" + SHEET_ID + "}}]}";
    }


}