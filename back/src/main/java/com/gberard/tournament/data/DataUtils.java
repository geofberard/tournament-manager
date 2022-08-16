package com.gberard.tournament.data;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.OptionalInt;

public class DataUtils {

    private static DateTimeFormatter DATE_FORMATER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private static Logger LOGGER = LoggerFactory.getLogger(DataUtils.class);

    public static LocalDateTime parseDate(String date, String time) {
        return LocalDateTime.of(LocalDate.parse(date, DATE_FORMATER), LocalTime.parse(time));
    }

    public static OptionalInt parseInteger(String value) {
        if(value.isEmpty()) {
            return OptionalInt.empty();
        }
        try {
            return OptionalInt.of(Integer.parseInt(value));
        } catch (final NumberFormatException e) {
            LOGGER.error("Unable to parse \"" + value +"\" into integer");
        }
        return OptionalInt.empty();
    }
}