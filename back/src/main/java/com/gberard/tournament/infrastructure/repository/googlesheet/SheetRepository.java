package com.gberard.tournament.infrastructure.repository.googlesheet;

import static java.util.stream.Collectors.toList;

import java.util.List;
import java.util.Optional;
import java.util.OptionalInt;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import com.gberard.tournament.domain.model.Identified;
import com.gberard.tournament.infrastructure.service.SpreadsheetCRUDService;
import com.google.common.annotations.VisibleForTesting;

import jakarta.persistence.EntityNotFoundException;

public abstract class SheetRepository<T extends Identified> {

    private static final Logger log = LoggerFactory.getLogger(SheetRepository.class);

    private final String tab;
    private final String range;

    @Autowired
    private SpreadsheetCRUDService spreadsheetCRUDService;

    protected SheetRepository(String range) {
        this.range = range;
        this.tab = range.substring(0, range.indexOf("!"));
    }

    public T create(T element) {
        spreadsheetCRUDService.appendCells(range, List.of(toRawData(element)));
        return  element;
    }

    public List<T> readAll() {
        return spreadsheetCRUDService.readCells(range).stream()
                .map(this::fromRawData)
                .collect(toList());
    }

    public T update(T element) {
        OptionalInt line = spreadsheetCRUDService.findRowIndex(getIdRange(), element.id());

        if (line.isEmpty()) {
            log.info("Updating element - cannot find element " + element);
            return null;
        }

        spreadsheetCRUDService.updateCells(tab + "!A" + line.getAsInt(), List.of(toRawData(element)));
        return element;
    }

    public void delete(T element) {
        OptionalInt line = spreadsheetCRUDService.findRowIndex(getIdRange(), element.id());

        if (line.isEmpty()) {
            log.info("Deleting element - cannot find element " + element);
        }

        spreadsheetCRUDService.deleteRaws(tab, line.getAsInt() - 1, 1);
    }

    public boolean deleteAll() {
        return spreadsheetCRUDService.deleteRaws(tab,1);
    }

    public Optional<T> read(String id) {
        return readAll().stream()
                .filter(t -> t.id().equals(id))
                .findFirst();
    }

    public T readOrThrow(String id) {
        return readAll().stream()
                .filter(t -> t.id().equals(id))
                .findFirst().orElseThrow(() -> new EntityNotFoundException(getLogName() + " : Unknown id [" + id + "]"));
    }

    private String getLogName() {
        return getClass().getSimpleName().replace("Sheet", "");
    }

    @VisibleForTesting
    protected abstract T fromRawData(List<Object> rawData);

    @VisibleForTesting
    protected abstract List<Object> toRawData(T element);

    private String getIdRange() {
        return tab + "!A:A";
    }
}
