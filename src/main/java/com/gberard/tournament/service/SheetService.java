package com.gberard.tournament.service;

import com.gberard.tournament.config.SpreadsheetConfig;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.SheetsScopes;
import com.google.api.services.sheets.v4.model.ValueRange;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.function.Function;

import static java.util.Collections.*;
import static java.util.stream.Collectors.toList;

@Component
public class SheetService {
    private static final String APPLICATION_NAME = "Google Sheets API Java Quickstart";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String TOKENS_DIRECTORY_PATH = "tokens";

    @Autowired
    private SpreadsheetConfig spreadsheetConfig;

    private static HttpCredentialsAdapter getSACredentials() throws IOException {
        GoogleCredentials credentials = GoogleCredentials.getApplicationDefault();
        if (credentials.createScopedRequired()) {
            credentials = credentials.createScoped(List.of(SheetsScopes.SPREADSHEETS_READONLY));
        }

        return new HttpCredentialsAdapter(credentials);
    }

    public <T> List<T> getData(String range, Function<List<Object>, T> objectMapper) {
        try {
            final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();

            Sheets service = new Sheets.Builder(HTTP_TRANSPORT, JSON_FACTORY, getSACredentials())
                    .setApplicationName(APPLICATION_NAME)
                    .build();
            ValueRange response = service.spreadsheets().values()
                    .get(spreadsheetConfig.getId(), range)
                    .execute();
            List<List<Object>> values = response.getValues();
            if (values == null || values.isEmpty()) {
                System.out.println("No data found.");
            } else {
                return values.stream()
                        .map(objectMapper)
                        .collect(toList());
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return emptyList();
    }
}
