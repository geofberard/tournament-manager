package com.gberard.tournament.repository;

import com.gberard.tournament.data.Identified;
import com.gberard.tournament.service.SpreadsheetCRUDService;
import com.google.common.annotations.VisibleForTesting;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.OptionalInt;

import static java.util.stream.Collectors.toList;

@Slf4j
public abstract class SheetRepository<T extends Identified> {

    private final String tab;
    private final String range;

    @Autowired
    private SpreadsheetCRUDService spreadsheetCRUDService;

    protected SheetRepository(String range) {
        this.range = range;
        this.tab = range.substring(0, range.indexOf("!"));
    }

    public boolean create(T element) {
        log.info("Reading creating - " + range);
        return spreadsheetCRUDService.appendCells(range, List.of(toRawData(element)));
    }

    public List<T> readAll() {
        log.info("Reading all - " + range);
        return spreadsheetCRUDService.readCells(range).stream()
                .map(this::fromRawData)
                .collect(toList());
    }

    public boolean delete(T element) {
        OptionalInt line = spreadsheetCRUDService.findRowIndex(tab, element.id());

        if (line.isEmpty()) {
            log.info("Deleting element - cannot find element " + element);
            return false;
        }

        log.info("Deleting element - " + range + " : " + element);
        return spreadsheetCRUDService.deleteRaws(tab, line.getAsInt(), 1);
    }

    public boolean deleteAll() {
        log.info("Deleting all - " + range);
        return spreadsheetCRUDService.deleteRaws(tab,1);
    }

    @VisibleForTesting
    protected abstract T fromRawData(List<Object> rawData);

    @VisibleForTesting
    protected abstract List<Object> toRawData(T element);
}
