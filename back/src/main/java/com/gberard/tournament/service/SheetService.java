package com.gberard.tournament.service;

import com.gberard.tournament.config.SpreadsheetConfig;
import com.gberard.tournament.data.Team;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.SheetsScopes;
import com.google.api.services.sheets.v4.model.ValueRange;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.function.Function;

import static java.util.Collections.*;
import static java.util.stream.Collectors.toList;

@Component
public class SheetService {
    private static final String APPLICATION_NAME = "Google Sheets API Java Quickstart";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String TOKENS_DIRECTORY_PATH = "tokens";

    static Logger logger = LoggerFactory.getLogger(SheetService.class);

    public final Cache<String, List<List<Object>>> spreadSheetCache =
            Caffeine.newBuilder()
                    .expireAfterAccess(30, TimeUnit.SECONDS)
                    .build();

    @Autowired
    private SpreadsheetConfig spreadsheetConfig;

    public <T> List<T> getData(String range, Function<List<Object>, T> objectMapper) {
        return (List<T>) spreadSheetCache.get(range, newRange -> readSpreadSheet(newRange))
                .stream()
                .map(objectMapper)
                .collect(toList());
    }

    private static HttpCredentialsAdapter getSACredentials() throws IOException {
        GoogleCredentials credentials = GoogleCredentials.getApplicationDefault();
        credentials = credentials.createScoped(List.of(SheetsScopes.SPREADSHEETS, SheetsScopes.DRIVE));

        return new HttpCredentialsAdapter(credentials);
    }

    private List<List<Object>> readSpreadSheet(String range) {
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
                logger.error("No data found.");
            } else {
                return values;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return emptyList();
    }
}
