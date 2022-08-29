package com.gberard.tournament.service;

import com.gberard.tournament.config.SpreadsheetConfig;
import com.google.api.client.json.Json;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.testing.http.MockHttpTransport;
import com.google.api.client.testing.http.MockLowLevelHttpResponse;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SheetServiceTest {

    private static String RANGE = "range";
    private static String SPREADSHEET_ID = "spreadsheetId";
    public static final String TARGET_URL =
            "https://sheets.googleapis.com/v4/spreadsheets/" + SPREADSHEET_ID + "/values/" + RANGE;

    @InjectMocks
    private SheetService sheetService;
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

    @Nested
    @DisplayName("createData()")
    class CreateData {

        @Test
        void shoud_use_google_api_to_call_spreadsheet_url() throws GeneralSecurityException, IOException {
            // Given
            var resp = new MockLowLevelHttpResponse()
                    .setStatusCode(200)
                    .setContentType(Json.MEDIA_TYPE)
                    .setContent("{\"spreadsheetId\":\"1UPLp5vo_q3XogkOoWtibyeaDww0imckzqIbhEY-UMHI\"," +
                            "\"tableRange\":\"Teams!A1:B10\"," +
                            "\"updates\":{\"spreadsheetId\":\"1UPLp5vo_q3XogkOoWtibyeaDww0imckzqIbhEY-UMHI\"," +
                            "\"updatedCells\":2,\"updatedColumns\":2,\"updatedRange\":\"Teams!A11:B11\"," +
                            "\"updatedRows\":1}}");

            var httpTransport = new MockHttpTransport.Builder()
                    .setLowLevelHttpResponse(resp)
                    .build();

            when(googleApiService.getHttpTransport()).thenReturn(httpTransport);

            // When
            sheetService.createData(RANGE, List.of("A","B","C"));

            // Then
            assertThat(httpTransport.getLowLevelHttpRequest().getUrl())
                    .isEqualTo(TARGET_URL + ":append?valueInputOption=USER_ENTERED");
            assertThat(httpTransport.getLowLevelHttpRequest().getContentAsString())
                    .contains("{\"values\":[[\"A\",\"B\",\"C\"]]}");
        }

    }

    @Nested
    @DisplayName("readData()")
    class ReadData {

        @Test
        void shoud_use_google_api_to_call_spreadsheet_url() throws GeneralSecurityException, IOException {
            // Given
            MockLowLevelHttpResponse resp = new MockLowLevelHttpResponse()
                    .setStatusCode(200)
                    .setContentType(Json.MEDIA_TYPE)
                    .setContent("{\"majorDimension\":\"ROWS\",\"range\":\"Teams!A2:B10\",\"values\":[[\"A\",\"B\"]]}");

            MockHttpTransport httpTransport = new MockHttpTransport.Builder()
                    .setLowLevelHttpResponse(resp)
                    .build();

            when(googleApiService.getHttpTransport()).thenReturn(httpTransport);

            // When
            sheetService.readData(RANGE);

            // Then
            assertThat(httpTransport.getLowLevelHttpRequest().getUrl())
                    .isEqualTo(TARGET_URL);
        }

    }

}