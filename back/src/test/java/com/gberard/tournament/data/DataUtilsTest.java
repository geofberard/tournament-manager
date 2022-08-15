package com.gberard.tournament.data;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.OptionalInt;

class DataUtilsTest {

    @Test
    public void parseDate_should_parse_formated_date() {
        // Given
        String date = "01/02/2022";
        String time = "11:05";

        // When
        LocalDateTime parsedDate = DataUtils.parseDate(date, time);

        // Then
        Assertions.assertThat(parsedDate.getYear()).isEqualTo(2022);
        Assertions.assertThat(parsedDate.getMonth()).isEqualTo(Month.FEBRUARY);
        Assertions.assertThat(parsedDate.getDayOfMonth()).isEqualTo(1);
    }

    @Test
    public void parseDate_should_parse_formated_time() {
        // Given
        String date = "01/02/2022";
        String time = "11:15";

        // When
        LocalDateTime parsedDate = DataUtils.parseDate(date, time);

        // Then
        Assertions.assertThat(parsedDate.getHour()).isEqualTo(11);
        Assertions.assertThat(parsedDate.getMinute()).isEqualTo(15);
    }

    @Test
    public void parseInteger_should_manager_empry_string() {
        // When
        OptionalInt parsedValue = DataUtils.parseInteger("");

        // Then
        Assertions.assertThat(parsedValue).isEmpty();
    }

    @Test
    public void parseInteger_should_manager_integer_in_string() {
        // When
        OptionalInt parsedValue = DataUtils.parseInteger("23");

        // Then
        Assertions.assertThat(parsedValue).hasValue(23);
    }

    @Test
    public void parseInteger_should_manager_incorrect_string() {
        // When
        OptionalInt parsedValue = DataUtils.parseInteger("qlkj");

        // Then
        Assertions.assertThat(parsedValue).isEmpty();
    }

}