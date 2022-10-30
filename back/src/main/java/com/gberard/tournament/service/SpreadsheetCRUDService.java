package com.gberard.tournament.service;

import com.gberard.tournament.config.SpreadsheetConfig;
import com.gberard.tournament.data.DataUtils;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import com.google.api.services.sheets.v4.Sheets;
import com.google.api.services.sheets.v4.model.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.OptionalInt;
import java.util.concurrent.TimeUnit;

import static java.util.Collections.emptyList;

@Service
@Slf4j
public class SpreadsheetCRUDService {

    public static final String USER_ENTERED = "USER_ENTERED";
    public static final String SEARCH_CELL = "L1";
    private static final String APPLICATION_NAME = "Google Sheets API CRUD";

    @Autowired
    private GoogleApiService googleApiService;

    @Autowired
    private SpreadsheetConfig spreadsheetConfig;

    private Sheets getService() throws GeneralSecurityException, IOException {
        Sheets service = new Sheets.Builder(
                googleApiService.getHttpTransport(),
                googleApiService.getJsonFactory(),
                googleApiService.getSACredentials())
                .setApplicationName(APPLICATION_NAME)
                .build();
        return service;
    }

    public boolean appendCells(String range, List<List<Object>> cells) {
        try {
            var valueRange = new ValueRange().setValues(cells);

            getService().spreadsheets().values()
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

    public final Cache<String, List<List<Object>>> spreadSheetCache =
            Caffeine.newBuilder()
                    .expireAfterAccess(30, TimeUnit.SECONDS)
                    .build();

    public List<List<Object>> readCells(String range) {
        return spreadSheetCache.get(range, newRange -> readCellsUncached(range));
    }

    private List<List<Object>> readCellsUncached(String range) {
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

    public boolean updateCells(String range, List<List<Object>> cells) {
        try {
            ValueRange valueRange = new ValueRange()
                    .setValues(cells);

            getService().spreadsheets().values()
                    .update(spreadsheetConfig.getId(), range, valueRange)
                    .setValueInputOption(USER_ENTERED)
                    .execute();

            log.info("Updating element - " + range + " : " + cells);
            return true;
        } catch (Exception e) {
            log.error("Updating element - Error for " + range + " : " + cells, e);
        }
        return false;
    }

    public boolean deleteCells(String range) {
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

    public OptionalInt findRowIndex(String range, String elementId) {
        try {
            String researcherRange = range.substring(0, range.indexOf("!")) + "!" + SEARCH_CELL;
            updateCells(researcherRange, List.of(List.of("=MATCH(\"" + elementId + "\"; " + range + "; 0)")));

            String line = readCells(researcherRange).get(0).get(0).toString();

            deleteCells(researcherRange);

            log.info("Searching element line - " + range + " : " + elementId + " : " + line);
            return DataUtils.parseInteger(line);
        } catch (Exception e) {
            log.error("Searching element line - Error for " + range + " : " + elementId, e);
        }
        return OptionalInt.empty();
    }

    public boolean deleteRaws(String sheetName, int startIndex) {
        return deleteRaws(sheetName, startIndex, OptionalInt.empty());
    }

    public boolean deleteRaws(String sheetName, int startIndex, int number) {
        return deleteRaws(sheetName, startIndex, OptionalInt.of(number));
    }

    private boolean deleteRaws(String sheetName, int startIndex, OptionalInt number) {
        try {
            OptionalInt sheetId = findSheetId(sheetName);

            if (sheetId.isEmpty()) {
                log.info("Deleting raws - Cannot find sheet " + sheetName + " : " + startIndex + " -> " + number);
                return false;
            }

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

            log.info("Deleting raws - " + sheetName + " : " + startIndex + " -> " + number);
            return true;
        } catch (Exception e) {
            log.error("Deleting raws - Error for " + sheetName + " : " + startIndex + " -> " + number, e);
        }
        return false;
    }

    public OptionalInt findSheetId(String sheetName) {
        try {
            Spreadsheet spreadsheet = getService().spreadsheets()
                    .get(spreadsheetConfig.getId())
                    .setRanges(List.of(sheetName))
                    .execute();

            if (!spreadsheet.getSheets().isEmpty()) {
                Integer sheetId = spreadsheet.getSheets().get(0).getProperties().getSheetId();
                log.info(spreadsheet.toString());
                log.info("Getting sheetid - " + sheetName + " : " + sheetId);
                return OptionalInt.of(sheetId);
            }
        } catch (Exception e) {
            log.error("Getting sheetid - Error for " + sheetName, e);
        }
        return OptionalInt.empty();
    }

}
