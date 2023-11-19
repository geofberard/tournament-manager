package com.gberard.tournament.infrastructure.serializer;

import com.gberard.tournament.infrastructure.serializer.RawUtils;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

import static java.util.List.of;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class RawUtilsTest {

    @Nested
    @DisplayName("getValue()")
    class GetValue {

        @Test
        void should_return_the_toString_method_of_targeted_element() {
            // Given
            String expectedValue = "expectedValue";
            Object targetValue = mock(Object.class);
            when(targetValue.toString()).thenReturn(expectedValue);
            List<Object> rawData = of("1", "2", targetValue, "4");

            // When
            Optional<String> foundValue = RawUtils.getValue(rawData, 2, Function.identity());

            // Then
            assertThat(foundValue).isPresent().hasValue(expectedValue);
        }

        @Test
        void should_return_the_result_of_mapper_with_value() {
            // Given
            String expectedValue = "expectedValue";
            Function<String, String> mockFunction = mock(Function.class);
            Mockito.when(mockFunction.apply(any())).thenReturn(expectedValue);

            // When
            Optional<String> foundValue = RawUtils.getValue(of("1", "2", "3"), 2, mockFunction);

            // Then
            verify(mockFunction, times(1)).apply("3");
            assertThat(foundValue).isPresent().hasValue(expectedValue);
        }

        @Test
        void should_return_an_empty_string_if_target_is_empty() {
            // When
            Optional<String> foundValue = RawUtils.getValue(of("1", "2", ""), 2, Function.identity());

            // Then
            assertThat(foundValue).isNotPresent();
        }

        @Test
        void should_return_an_empty_string_if_target_dont_exist() {
            // When
            Optional<String> foundValue = RawUtils.getValue(of("1", "2", "3"), 3, Function.identity());

            // Then
            assertThat(foundValue).isNotPresent();
        }
    }

    @Nested
    @DisplayName("getStringValue()")
    class GetStringValue {

        @Test
        void should_return_value() {
            // When
            Optional<String> foundValue = RawUtils.getStringValue(of("1", "2", "3"), 2);

            // Then
            assertThat(foundValue).isPresent().hasValue("3");
        }

    }

    @Nested
    @DisplayName("getBooleanValue()")
    class GetBooleanValue {

        @Test
        void should_return_empty_when_format_is_ok() {
            // Given
            List<Object> values = of("1", "true", "false");

            // Then
            Assertions.assertThat(RawUtils.getBooleanValue(values, 1)).isPresent().hasValue(true);
            Assertions.assertThat(RawUtils.getBooleanValue(values, 2)).isPresent().hasValue(false);
        }

        @Test
        void should_return_false_when_format_is_ko() {
            // Given
            List<Object> values = of("1", "anyString");

            // Then
            Assertions.assertThat(RawUtils.getBooleanValue(values, 1)).isPresent().hasValue(false);
        }

    }

    @Nested
    @DisplayName("getIntValue()")
    class GetIntValue {


        @Test
        public void should_manage_empry_string() {
            // Given
            List<Object> values = of("", "2");

            // Then
            Assertions.assertThat(RawUtils.getIntValue(values, 0)).isNotPresent();
        }

        @Test
        public void should_manage_integer_in_string() {
            // Given
            List<Object> values = of("", "23");

            // Then
            Assertions.assertThat(RawUtils.getIntValue(values, 1)).isPresent().hasValue(23);
        }

        @Test
        public void should_manager_incorrect_string() {
            // Given
            List<Object> values = of("sdfsdf", "2");

            // Then
            Assertions.assertThat(RawUtils.getIntValue(values, 0)).isNotPresent();
        }

    }


    @Nested
    @DisplayName("getEnumValue()")
    class GetEnumValue {

        private enum TestEnum {
            VALUE1,VALUE2
        }

        @Test
        void should_return_element_based_on_name() {
            // Given
            List<Object> values = of("1", "VALUE2", "false");

            // Then
            Assertions.assertThat(RawUtils.getEnumValue(values, 1, TestEnum.class)).isPresent().hasValue(TestEnum.VALUE2);
        }

        @Test
        void should_return_empty_on_wrong_element() {
            // Given
            List<Object> values = of("1", "VALUE3", "false");

            // Then
            Assertions.assertThat(RawUtils.getEnumValue(values, 1, TestEnum.class)).isNotPresent();
        }

    }

    @Nested
    @DisplayName("getDateTimeValue()")
    class GetDateTimeValue {

        @Test
        void should_return_value_when_date_and_time_are_specified() {
            // Given
            List<Object> values = of("29/08/2022", "10:30");

            // Then
            Assertions.assertThat(RawUtils.getDateTimeValue(values, 0, 1)).isPresent()
                    .hasValue(LocalDateTime.of(2022,8,29,10,30));
        }

        @Test
        void should_return_empty_on_date_unspecified() {
            // Given
            List<Object> values = of("", "10:30");

            // Then
            Assertions.assertThat(RawUtils.getDateTimeValue(values, 0, 1)).isNotPresent();
        }

        @Test
        void should_return_empty_on_time_unspecified() {
            // Given
            List<Object> values = of("29/08/2022", "");

            // Then
            Assertions.assertThat(RawUtils.getDateTimeValue(values, 0, 1)).isNotPresent();
        }

        @Test
        void should_return_empty_on_wrong_format() {
            // Given
            List<Object> values = of("29-08-2022", "1030");

            // Then
            Assertions.assertThat(RawUtils.getDateTimeValue(values, 0, 1)).isNotPresent();
        }

    }

}
