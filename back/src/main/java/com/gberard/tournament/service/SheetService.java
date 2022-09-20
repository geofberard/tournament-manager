package com.gberard.tournament.service;

import com.gberard.tournament.config.SpreadsheetConfig;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.model.ValueRange;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Stream;

import static java.util.Collections.emptyList;

@Component
public class SheetService {
    private static final String APPLICATION_NAME = "Google Sheets API Java Quickstart";

    static Logger logger = LoggerFactory.getLogger(SheetService.class);

    public final Cache<String, List<List<Object>>> spreadSheetCache =
            Caffeine.newBuilder()
                    .expireAfterAccess(30, TimeUnit.SECONDS)
                    .build();

    @Autowired
    private SpreadsheetConfig spreadsheetConfig;

    @Autowired
    private GoogleApiService googleApiService;

    public static String getValue(List<Object> value, int index) {
        return value.size() > index ? value.get(index).toString() : "";
    }

    public Stream<List<Object>> getData(String range) {
        return spreadSheetCache.get(range, newRange -> readSpreadSheet(newRange))
                .stream();
    }

    private List<List<Object>> readSpreadSheet(String range) {
        try {
            Sheets service = new Sheets.Builder(
                    googleApiService.getHttpTransport(),
                    googleApiService.getJsonFactory(),
                    googleApiService.getSACredentials())
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
