package com.gberard.tournament.repository;

import com.gberard.tournament.config.SpreadsheetConfig;
import com.gberard.tournament.data.DataUtils;
import com.gberard.tournament.data.Identified;
import com.gberard.tournament.service.GoogleApiService;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.model.*;
import com.google.common.annotations.VisibleForTesting;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.OptionalInt;

import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.toList;

@Slf4j
public abstract class SheetRepository<T extends Identified> {

    public static final String USER_ENTERED = "USER_ENTERED";
    private static final String APPLICATION_NAME = "Google Sheets API Java Quickstart";
    public static final String SEARCH_CELL = "L1";
    private final String tab;
    private final String range;

    @Autowired
    private SpreadsheetConfig spreadsheetConfig;

    @Autowired
    private GoogleApiService googleApiService;

    protected SheetRepository(String range) {
        this.range = range;
        this.tab = range.substring(0, range.indexOf("!"));
    }

    public boolean create(T element) {
        try {
            var valueRange = new ValueRange().setValues(List.of(toRawData(element)));

            var response = getService().spreadsheets().values()
                    .append(spreadsheetConfig.getId(), range, valueRange)
                    .setValueInputOption(USER_ENTERED)
                    .execute();

            log.info("Creating new element - " + range + " : " + element + " : " + response.toString());
            return true;
        } catch (Exception e) {
            log.error("Creating new element - Error for " + range + " : " + element, e);
        }
        return false;
    }

    public List<T> readAll() {
        log.info("Reading all - " + range);
        return readCells(range).stream()
                .map(this::fromRawData)
                .collect(toList());
    }

    public boolean delete(T element) {
        OptionalInt line = searchElementLine(element);

        if (line.isEmpty()) {
            log.info("Deleting element - cannot find element " + element);
            return false;
        }

        log.info("Deleting element - " + range + " : " + element);
        return deleteRaws(line.getAsInt(), 1);
    }

    public boolean deleteAll() {
        log.info("Deleting all - " + range);
        return deleteRaws(1);
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
    protected OptionalInt searchElementLine(T element) {
        try {
            ValueRange valueRange = new ValueRange();
            valueRange.setValues(List.of(
                    List.of("=MATCH(\"" + element.id() + "\"; " + tab + "!A:A; 0) - 1")
            ));

            String researcherRange = tab + "!" + SEARCH_CELL;

            getService().spreadsheets().values()
                    .update(spreadsheetConfig.getId(), researcherRange, valueRange)
                    .setValueInputOption(USER_ENTERED)
                    .execute();

            String line = readCells(researcherRange).get(0).get(0).toString();

            deleteCells(researcherRange);

            log.info("Searching element line - " + range + " : " + element + " : " + line);
            return DataUtils.parseInteger(line);
        } catch (Exception e) {
            log.error("Searching element line - Error for " + range + " : " + element, e);
        }
        return OptionalInt.empty();
    }

    private OptionalInt getSheetId(String name) {
        try {
            Spreadsheet spreadsheet = getService().spreadsheets()
                    .get(spreadsheetConfig.getId())
                    .setRanges(List.of(name))
                    .execute();

            if (!spreadsheet.getSheets().isEmpty()) {
                Integer sheetId = spreadsheet.getSheets().get(0).getProperties().getSheetId();
                log.info(spreadsheet.toString());
                log.info("Getting sheetid - " + range + " : " + sheetId);
                return OptionalInt.of(sheetId);
            }
        } catch (Exception e) {
            log.error("Getting sheetid - Error for " + range, e);
        }
        return OptionalInt.empty();
    }

    @VisibleForTesting
    protected boolean createCells(List<List<Object>> cells) {
        try {
            var valueRange = new ValueRange().setValues(cells);

            var response = getService().spreadsheets().values()
                    .append(spreadsheetConfig.getId(), range, valueRange)
                    .setValueInputOption(USER_ENTERED)
                    .execute();

            log.info("Creating new element - " + range + " : " + cells);
            return true;
        } catch (Exception e) {
            log.error("Creating new element - Error for " + range + " : " + cells, e);
        }
        return false;
    }

    @VisibleForTesting
    protected List<List<Object>> readCells(String range) {
        try {
            var response = getService().spreadsheets().values()
                    .get(spreadsheetConfig.getId(), range)
                    .execute();

            List<List<Object>> values = response.getValues();

            if (values == null || values.isEmpty()) {
                log.error("Reading cells - No data found in " + range);
            } else {
                log.info("Reading cells - " + range);
                return values;
            }
        } catch (Exception e) {
            log.error("Reading cells - Error for " + range, e);
        }
        return emptyList();
    }

    @VisibleForTesting
    protected boolean deleteCells(String range) {
        try {
            var dataFilter = new DataFilter().setA1Range(range);

            var clearRequest = new BatchClearValuesByDataFilterRequest().setDataFilters(List.of(dataFilter));

            getService().spreadsheets().values()
                    .batchClearByDataFilter(spreadsheetConfig.getId(), clearRequest)
                    .execute();

            log.info("Deleting celles - " + range);
            return true;
        } catch (Exception e) {
            log.error("Deleting cells - Error for " + range, e);
        }
        return false;
    }

    @VisibleForTesting
    protected boolean deleteRaws(int startIndex) {
        return deleteRaws(startIndex, OptionalInt.empty());
    }

    @VisibleForTesting
    protected boolean deleteRaws(int startIndex, int number) {
        return deleteRaws(startIndex, OptionalInt.of(number));
    }

    private boolean deleteRaws(int startIndex, OptionalInt number) {
        try {
            OptionalInt sheetId = getSheetId(tab);

            DimensionRange dimensionRange = new DimensionRange()
                    .setSheetId(sheetId.orElse(0))
                    .setDimension("ROWS")
                    .setStartIndex(startIndex);
            number.ifPresent(nb -> dimensionRange.setEndIndex(startIndex + nb));

            DeleteDimensionRequest deleteRequest = new DeleteDimensionRequest().setRange(dimensionRange);

            Request updateRequest = new Request().setDeleteDimension(deleteRequest);

            BatchUpdateSpreadsheetRequest batchUpdateRequest = new BatchUpdateSpreadsheetRequest()
                    .setRequests(List.of(updateRequest));

            getService().spreadsheets()
                    .batchUpdate(spreadsheetConfig.getId(), batchUpdateRequest)
                    .execute();

            log.info("Deleting raws - " + range + " : " + startIndex + " -> " + number);
            return true;
        } catch (Exception e) {
            log.error("Deleting raws - Error for " + range + " : " + startIndex + " -> " + number, e);
        }
        return false;
    }

    @VisibleForTesting
    protected abstract T fromRawData(List<Object> rawData);

    @VisibleForTesting
    protected abstract List<Object> toRawData(T element);
}
