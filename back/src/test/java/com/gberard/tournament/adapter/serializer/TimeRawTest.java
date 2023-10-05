package com.gberard.tournament.adapter.serializer;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.time.LocalTime;
import java.time.format.DateTimeParseException;

import static org.assertj.core.api.Assertions.assertThat;

class TimeRawTest {

    @Test
    public void should_serialize_time_PM() {
        // Given
        LocalTime time = LocalTime.of(14,42);

        // Then
        assertThat(TimeRaw.serialize(time)).isEqualTo("14:42");
    }

    @Test
    public void should_serialize_time_AM() {
        // Given
        LocalTime time = LocalTime.of(6,20);

        // Then
        assertThat(TimeRaw.serialize(time)).isEqualTo("06:20");
    }

    @Test
    public void should_deserialize_formated_time() {
        // Given
        String time = "11:15";

        // When
        LocalTime parsedTime = TimeRaw.deserialize(time);

        // Then
        assertThat(parsedTime.getHour()).isEqualTo(11);
        assertThat(parsedTime.getMinute()).isEqualTo(15);
    }

    @Test
    public void should_not_deserialize_format_error() {
        // Given
        String time = "1h25";

        // When
        Assertions.assertThrows(DateTimeParseException.class, () -> TimeRaw.deserialize(time));
    }

}