package com.gberard.tournament.serializer;

import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;
import java.util.OptionalInt;
import java.util.function.Function;

@Slf4j
public class RawUtils {

    public static <T> Optional<T> getValue(List<Object> value, int index, Function<String, T> mapper) {
        var serialized = value.size() > index ? value.get(index).toString() : "";
        if (serialized.isEmpty()) {
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

    public static OptionalInt getIntValue(List<Object> value, int index) {
        try {
            return getValue(value, index, Integer::parseInt).map(OptionalInt::of).orElseGet(OptionalInt::empty);
        } catch (NumberFormatException e) {
            return OptionalInt.empty();
        }

    }

    public static <T extends Enum<T>> Optional<T> getEnumValue(List<Object> value, int index, Class<T> enumClass) {
        Optional<String> stringValue = getStringValue(value, index);

        if (stringValue.isEmpty()) {
            return Optional.empty();
        }

        try {
            return Optional.of(Enum.valueOf(enumClass, stringValue.get()));
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }

    }

    public static Optional<LocalDateTime> getDateTimeValue(List<Object> value, int indexDate, int indexTime) {
        var date = getStringValue(value, indexDate);
        var time = getStringValue(value, indexTime);

        if (date.isEmpty() || time.isEmpty()) {
            return Optional.empty();
        }

        try {
            return Optional.of(LocalDateTime.of(
                    DateRaw.deserialize(date.get()),
                    TimeRaw.deserialize(time.get()))
            );
        } catch (DateTimeParseException e) {
            return Optional.empty();
        }
    }

}
