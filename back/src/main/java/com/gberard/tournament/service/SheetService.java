package com.gberard.tournament.service;

import com.gberard.tournament.config.SpreadsheetConfig;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.model.ValueRange;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

import static java.util.Collections.emptyList;

@Slf4j
@Component
public class SheetService {
    private static final String APPLICATION_NAME = "Google Sheets API Java Quickstart";
    public static final String USER_ENTERED = "USER_ENTERED";

    public final Cache<String, List<List<Object>>> spreadSheetCache =
            Caffeine.newBuilder()
                    .expireAfterAccess(30, TimeUnit.SECONDS)
                    .build();

    @Autowired
    private SpreadsheetConfig spreadsheetConfig;

    @Autowired
    private GoogleApiService googleApiService;

    public boolean createData(String range, List<Object> data) {
        try {
            ValueRange valueRange = new ValueRange().setValues(List.of(data));

            var response = getService().spreadsheets().values()
                    .append(spreadsheetConfig.getId(), range, valueRange)
                    .setValueInputOption(USER_ENTERED)
                    .execute();
            
            log.info("Creating new data " + response.toString());
            return true;
        } catch (Exception e) {
            log.error("Error while creating data", e);
        }
        return false;
    }

    public Stream<List<Object>> readData(String range) {
        return spreadSheetCache.get(range, newRange -> readSpreadSheet(newRange))
                .stream();
    }

    private List<List<Object>> readSpreadSheet(String range) {
        try {
            Sheets service = getService();
            ValueRange response = service.spreadsheets().values()
                    .get(spreadsheetConfig.getId(), range)
                    .execute();
            List<List<Object>> values = response.getValues();
            if (values == null || values.isEmpty()) {
                log.error("No data found.");
            } else {
                return values;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return emptyList();
    }

    private Sheets getService() throws GeneralSecurityException, IOException {
        Sheets service = new Sheets.Builder(
                googleApiService.getHttpTransport(),
                googleApiService.getJsonFactory(),
                googleApiService.getSACredentials())
                .setApplicationName(APPLICATION_NAME)
                .build();
        return service;
    }
}
