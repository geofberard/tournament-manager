package com.gberard.tournament.service;

import com.gberard.tournament.config.SpreadsheetConfig;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.model.BatchClearValuesByDataFilterRequest;
import com.google.api.services.sheets.v4.model.DataFilter;
import com.google.api.services.sheets.v4.model.ValueRange;
import com.google.common.annotations.VisibleForTesting;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;

import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.toList;

@Slf4j
public abstract class SheetService<T> {
    public static final String USER_ENTERED = "USER_ENTERED";
    private static final String APPLICATION_NAME = "Google Sheets API Java Quickstart";

    @Autowired
    private SpreadsheetConfig spreadsheetConfig;

    @Autowired
    private GoogleApiService googleApiService;

    private final String range;

    protected SheetService(String range) {
        this.range = range;
    }

    public boolean create(T data) {
        try {
            var valueRange = new ValueRange().setValues(List.of(toRawData(data)));

            var response = getService().spreadsheets().values()
                    .append(spreadsheetConfig.getId(), range, valueRange)
                    .setValueInputOption(USER_ENTERED)
                    .execute();

            log.info("Creating new data - " + response.toString());
            return true;
        } catch (Exception e) {
            log.error("Creating new data - Error", e);
        }
        return false;
    }

    public List<T> readAll() {
        try {
            var response = getService().spreadsheets().values()
                    .get(spreadsheetConfig.getId(), range)
                    .execute();

            List<List<Object>> values = response.getValues();

            if (values == null || values.isEmpty()) {
                log.error("Reading all - No data found.");
            } else {
                log.info("Reading all - " + response.toString());
                return values.stream()
                        .map(this::fromRawData)
                        .collect(toList());
            }
        } catch (Exception e) {
            log.error("Reading all - Error", e);
        }
        return emptyList();
    }

    public boolean deleteAll() {
        try {
            var dataFilter = new DataFilter().setA1Range(range);

            var clearRequest = new BatchClearValuesByDataFilterRequest().setDataFilters(List.of(dataFilter));

            var response = getService().spreadsheets().values()
                    .batchClearByDataFilter(spreadsheetConfig.getId(), clearRequest)
                    .execute();

            log.info("Deleting all - " + response.toString());
            return true;
        } catch (Exception e) {
            log.error("Deleting all - Error", e);
        }
        return false;
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

    @VisibleForTesting
    protected abstract T fromRawData(List<Object> rawData);

    @VisibleForTesting
    protected abstract List<Object> toRawData(T element);
}
