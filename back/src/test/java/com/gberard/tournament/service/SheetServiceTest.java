package com.gberard.tournament.service;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;

import java.util.List;

import static com.gberard.tournament.service.SheetService.getValue;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class SheetServiceTest {

    //TODO

    @Nested
    @DisplayName("getValue()")
    class GetValue {

        @Test
        void should_return_the_toString_method_of_targeted_element() {
            // Given
            String expectedValue = "expectedValue";
            Object targetValue = mock(Object.class);
            when(targetValue.toString()).thenReturn(expectedValue);
            List<Object> rawData = List.of("1","2",targetValue,"4");

            // When
            String foundValue = getValue(rawData, 2);

            // Then
            assertThat(foundValue).isEqualTo(expectedValue);
        }

        @Test
        void should_return_an_empty_string_if_target_dont_exist() {
            // Given
            List<Object> rawData = List.of("1","2","3");

            // When
            String foundValue = getValue(rawData, 5);

            // Then
            assertThat(foundValue).isEmpty();
        }
    }

}