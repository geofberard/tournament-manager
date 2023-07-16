package com.gberard.tournament.data;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.OptionalInt;
import java.util.function.Function;

import static java.util.stream.Collectors.joining;
//@PATATOR
@Slf4j
public class DataUtils {

    public static final String LIST_SEPARATOR = ";";
    public static final String SCORE_SEPARATOR = "-";

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
        if (value.isEmpty()) {
            return OptionalInt.empty();
        }
        try {
            return OptionalInt.of(Integer.parseInt(value));
        } catch (final NumberFormatException e) {
            log.error("Unable to parse \"" + value + "\" into integer");
        }
        return OptionalInt.empty();
    }

    public static String getValue(List<Object> value, int index) {
        return value.size() > index ? value.get(index).toString() : "";
    }

    public static <T> Optional<T> getValue(List<Object> value, int index, Function<String,T> mapper) {
        var serialized = getValue(value, index);
        if(serialized.isEmpty()) {
            return Optional.empty();
        }
        return Optional.of(mapper.apply(serialized));
    }

    public static Optional<String> getStringValue(List<Object> value, int index) {
        return getValue(value, index, Function.identity());
    }

    public static Optional<Boolean> getBooleanValue(List<Object> value, int index) {
        return getValue(value, index, Boolean::parseBoolean);
    }

    public static Optional<List<String>> getListValue(List<Object> value, int index) {
        return getValue(value, index, serialized -> Arrays.stream(serialized.split(LIST_SEPARATOR)).toList());
    }

    public static <T extends Enum<T>> Optional<T> getEnumValue(List<Object> value, int index, Class<T> enumClass) {
        return getValue(value, index, serialized -> Enum.valueOf(enumClass, serialized));
    }

    public static Optional<LocalDateTime> getDateTimeValue(List<Object> value, int indexDate, int indexTime) {
        var date = getStringValue(value, indexDate);
        var time = getStringValue(value, indexTime);

        if(date.isEmpty() || time.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(parseDateTime(date.get(), time.get()));
    }

    public static String toListValue(List<String> elements) {
        return elements.stream().collect(joining(LIST_SEPARATOR));
    }
}
