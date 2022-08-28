package com.gberard.tournament.service;

import com.gberard.tournament.config.SpreadsheetConfig;
import com.google.api.client.json.Json;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.testing.http.MockHttpTransport;
import com.google.api.client.testing.http.MockLowLevelHttpResponse;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
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

import static com.gberard.tournament.service.SheetService.getValue;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SheetServiceTest {

    @InjectMocks
    private SheetService sheetService;

    @Mock
    private GoogleApiService googleApiService;

    @Mock
    private SpreadsheetConfig spreadsheetConfig;

    @Nested
    @DisplayName("getValue()")
    class GetData {

        @Test
        void shoud_use_google_api_to_call_spreadsheet_url() throws GeneralSecurityException, IOException {
            // Given
            String range = "range";
            String spreadsheetId = "spreadsheetId";

            GoogleCredentials googleCredentials = GoogleCredentials.newBuilder()
                    .setAccessToken(mock(AccessToken.class))
                    .build();

            MockLowLevelHttpResponse resp = new MockLowLevelHttpResponse()
                    .setStatusCode(200)
                    .setContentType(Json.MEDIA_TYPE)
                    .setContent("{\"error\":\"invalid credentials\"}")
                    .setContent("{\"majorDimension\":\"ROWS\",\"range\":\"Teams!A2:B10\",\"values\":[[\"A\",\"B\"]]}");

            MockHttpTransport httpTransport = new MockHttpTransport.Builder()
                    .setLowLevelHttpResponse(resp)
                    .build();

            when(googleApiService.getHttpTransport()).thenReturn(httpTransport);
            when(googleApiService.getSACredentials()).thenReturn(new HttpCredentialsAdapter(googleCredentials));
            when(googleApiService.getJsonFactory()).thenReturn(GsonFactory.getDefaultInstance());
            when(spreadsheetConfig.getId()).thenReturn(spreadsheetId);

            // When
            sheetService.getData(range);

            // Then
            assertThat(httpTransport.getLowLevelHttpRequest().getUrl())
                    .isEqualTo("https://sheets.googleapis.com/v4/spreadsheets/" + spreadsheetId + "/values/" + range);
        }

    }

    @Nested
    @DisplayName("getValue()")
    class GetValue {

        @Test
        void should_return_the_toString_method_of_targeted_element() {
            // Given
            String expectedValue = "expectedValue";
            Object targetValue = mock(Object.class);
            when(targetValue.toString()).thenReturn(expectedValue);
            List<Object> rawData = List.of("1", "2", targetValue, "4");

            // When
            String foundValue = getValue(rawData, 2);

            // Then
            assertThat(foundValue).isEqualTo(expectedValue);
        }

        @Test
        void should_return_an_empty_string_if_target_dont_exist() {
            // Given
            List<Object> rawData = List.of("1", "2", "3");

            // When
            String foundValue = getValue(rawData, 5);

            // Then
            assertThat(foundValue).isEmpty();
        }
    }

}