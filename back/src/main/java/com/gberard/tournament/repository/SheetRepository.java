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
        return spreadsheetCRUDService.appendCells(range, List.of(toRawData(element)));
    }

    public List<T> readAll() {
        return spreadsheetCRUDService.readCells(range).stream()
                .map(this::fromRawData)
                .collect(toList());
    }

    public boolean update(T element) {
        OptionalInt line = spreadsheetCRUDService.findRowIndex(getIdRange(), element.id());

        if (line.isEmpty()) {
            log.info("Updating element - cannot find element " + element);
            return false;
        }

        return spreadsheetCRUDService.updateCells(tab + "!A" + line.getAsInt(), List.of(toRawData(element)));
    }

    public boolean delete(T element) {
        OptionalInt line = spreadsheetCRUDService.findRowIndex(getIdRange(), element.id());

        if (line.isEmpty()) {
            log.info("Deleting element - cannot find element " + element);
            return false;
        }

        return spreadsheetCRUDService.deleteRaws(tab, line.getAsInt() - 1, 1);
    }

    public boolean deleteAll() {
        return spreadsheetCRUDService.deleteRaws(tab,1);
    }

    @VisibleForTesting
    protected abstract T fromRawData(List<Object> rawData);

    @VisibleForTesting
    protected abstract List<Object> toRawData(T element);

    private String getIdRange() {
        return tab + "!A:A";
    }
}
