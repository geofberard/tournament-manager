package com.gberard.tournament.data;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.OptionalInt;

@Slf4j
public class DataUtils {

    private static DateTimeFormatter DATE_FORMATER = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    private static DateTimeFormatter TIME_FORMATER = DateTimeFormatter.ofPattern("kk:mm");

    public static LocalDateTime parseDateTime(String date, String time) {
        return LocalDateTime.of(LocalDate.parse(date, DATE_FORMATER), LocalTime.parse(time));
    }

    public static String formatDate(LocalDateTime date) {
        return DATE_FORMATER.format(date);
    }

    public static String formatTime(LocalDateTime date) {
        return TIME_FORMATER.format(date);
    }

    public static OptionalInt parseInteger(String value) {
        if(value.isEmpty()) {
            return OptionalInt.empty();
        }
        try {
            return OptionalInt.of(Integer.parseInt(value));
        } catch (final NumberFormatException e) {
            log.error("Unable to parse \"" + value +"\" into integer");
        }
        return OptionalInt.empty();
    }

    public static String getValue(List<Object> value, int index) {
        return value.size() > index ? value.get(index).toString() : "";
    }
}
