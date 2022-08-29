package com.gberard.tournament.data;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.List;
import java.util.OptionalInt;

import static com.gberard.tournament.data.DataUtils.getValue;
import static java.time.Month.JANUARY;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class DataUtilsTest {


    @Nested
    @DisplayName("parseDateTime()")
    class ParseDateTime {

        @Test
        public void should_parse_formated_date() {
            // Given
            String date = "01/02/2022";
            String time = "11:05";

            // When
            LocalDateTime parsedDate = DataUtils.parseDateTime(date, time);

            // Then
            assertThat(parsedDate.getYear()).isEqualTo(2022);
            assertThat(parsedDate.getMonth()).isEqualTo(Month.FEBRUARY);
            assertThat(parsedDate.getDayOfMonth()).isEqualTo(1);
        }

        @Test
        public void should_parse_formated_time() {
            // Given
            String date = "01/02/2022";
            String time = "11:15";

            // When
            LocalDateTime parsedDate = DataUtils.parseDateTime(date, time);

            // Then
            assertThat(parsedDate.getHour()).isEqualTo(11);
            assertThat(parsedDate.getMinute()).isEqualTo(15);
        }
    }

    @Nested
    @DisplayName("parseDate()")
    class formatDate {

        @Test
        public void should_formated_date() {
            // Given
            LocalDateTime date = LocalDateTime.of(2022, JANUARY.getValue(),24,0,0);

            // When
            String formatedDate = DataUtils.formatDate(date);

            // Then
            assertThat(formatedDate).isEqualTo("24/01/2022");
        }

        @Test
        public void should_formated_time_PM() {
            // Given
            LocalDateTime date = LocalDateTime.of(2022, JANUARY.getValue(),24,14,42);

            // When
            String formatedTime = DataUtils.formatTime(date);

            // Then
            assertThat(formatedTime).isEqualTo("14:42");
        }

        @Test
        public void should_formated_time_AM() {
            // Given
            LocalDateTime date = LocalDateTime.of(2022, JANUARY.getValue(),24,6,20);

            // When
            String formatedTime = DataUtils.formatTime(date);

            // Then
            assertThat(formatedTime).isEqualTo("06:20");
        }
    }

    @Nested
    @DisplayName("parseInteger()")
    class GetTeamStatusTest {


        @Test
        public void should_manager_empry_string() {
            // When
            OptionalInt parsedValue = DataUtils.parseInteger("");

            // Then
            assertThat(parsedValue).isEmpty();
        }

        @Test
        public void should_manager_integer_in_string() {
            // When
            OptionalInt parsedValue = DataUtils.parseInteger("23");

            // Then
            assertThat(parsedValue).hasValue(23);
        }

        @Test
        public void should_manager_incorrect_string() {
            // When
            OptionalInt parsedValue = DataUtils.parseInteger("qlkj");

            // Then
            assertThat(parsedValue).isEmpty();
        }

    }

    @Nested
    @DisplayName("getValue()")
    class GetValue {

        @Test
        void should_return_the_toString_method_of_targeted_element() {
            // Given
            String expectedValue = "expectedValue";
            Object targetValue = mock(Object.class);
            when(targetValue.toString()).thenReturn(expectedValue);
            List<Object> rawData = List.of("1", "2", targetValue, "4");

            // When
            String foundValue = getValue(rawData, 2);

            // Then
            assertThat(foundValue).isEqualTo(expectedValue);
        }

        @Test
        void should_return_an_empty_string_if_target_dont_exist() {
            // Given
            List<Object> rawData = List.of("1", "2", "3");

            // When
            String foundValue = getValue(rawData, 5);

            // Then
            assertThat(foundValue).isEmpty();
        }
    }

}
