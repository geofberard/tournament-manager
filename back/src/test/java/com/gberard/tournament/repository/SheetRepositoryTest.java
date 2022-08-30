package com.gberard.tournament.repository;

import com.gberard.tournament.config.SpreadsheetConfig;
import com.gberard.tournament.service.GoogleApiService;
import com.google.api.client.json.Json;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.testing.http.MockHttpTransport;
import com.google.api.client.testing.http.MockLowLevelHttpResponse;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.gson.Gson;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mock;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class SheetRepositoryTest {

    protected static String SPREADSHEET_ID = "spreadsheetId";
    protected static final String TARGET_URL =
            "https://sheets.googleapis.com/v4/spreadsheets/" + SPREADSHEET_ID + "/values";

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

    protected MockHttpTransport mockServerResponse() throws Exception {
        return mockServerResponse(null);
    }

    protected MockHttpTransport mockServerResponse(String json) throws Exception {
        var resp = new MockLowLevelHttpResponse()
                .setStatusCode(200)
                .setContentType(Json.MEDIA_TYPE)
                .setContent(Optional.ofNullable(json).orElse("{}"));

        var httpTransport = new MockHttpTransport.Builder()
                .setLowLevelHttpResponse(resp)
                .build();

        when(googleApiService.getHttpTransport()).thenReturn(httpTransport);

        return httpTransport;
    }

    protected String getGetResponse(List<List<Object>> values) {
        String jsonValues = new Gson().toJson(values);
        return "{\"majorDimension\":\"ROWS\",\"range\":\"Teams!A2:B10\",\"values\":" + jsonValues + "}";
    }

}