package com.gberard.tournament.serializer;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.Month;
import java.time.format.DateTimeParseException;

import static java.time.Month.JANUARY;
import static org.assertj.core.api.Assertions.assertThat;

class DateRawTest {


    @Test
    public void should_serialize_date() {
        // Given
        LocalDate date = LocalDate.of(2022, JANUARY.getValue(),24);

        // Then
        assertThat(DateRaw.serialize(date)).isEqualTo("24/01/2022");
    }

    @Test
    public void should_deserialize_formated_date() {
        // Given
        String time = "24/01/2022";

        // When
        LocalDate parsedDate = DateRaw.deserialize(time);

        // Then
        assertThat(parsedDate.getYear()).isEqualTo(2022);
        assertThat(parsedDate.getMonth()).isEqualTo(JANUARY);
        assertThat(parsedDate.getDayOfMonth()).isEqualTo(24);
    }

    @Test
    public void should_not_deserialize_format_error() {
        // Given
        String time = "2022-GF-02";

        // When
        Assertions.assertThrows(DateTimeParseException.class, () -> DateRaw.deserialize(time));
    }

}