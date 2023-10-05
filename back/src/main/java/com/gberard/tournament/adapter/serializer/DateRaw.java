package com.gberard.tournament.adapter.serializer;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public final class DateRaw {

    private static final DateTimeFormatter DATE_FORMATER = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    public static String serialize(LocalDate date) {
        return DATE_FORMATER.format(date);
    }

    public static LocalDate deserialize(String raw) {
        return LocalDate.parse(raw, DATE_FORMATER);
    }

}