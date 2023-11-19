package com.gberard.tournament.infrastructure.serializer;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

public final class TimeRaw {

    private static DateTimeFormatter TIME_FORMATER = DateTimeFormatter.ofPattern("kk:mm");

    public static String serialize(LocalTime time) {
        return TIME_FORMATER.format(time);
    }

    public static LocalTime deserialize(String raw) {
        return LocalTime.parse(raw, TIME_FORMATER);
    }

}
