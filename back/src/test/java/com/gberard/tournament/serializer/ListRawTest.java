package com.gberard.tournament.serializer;

import org.junit.jupiter.api.Test;

import java.util.List;

import static com.gberard.tournament.serializer.ListRaw.deserialize;
import static com.gberard.tournament.serializer.ListRaw.serialize;
import static org.assertj.core.api.Assertions.assertThat;

class ListRawTest {

    @Test
    void should_serialize_list_of_one_element() {
        assertThat(serialize(List.of("1"))).isEqualTo("1");
    }

    @Test
    void should_serialize_list_of_multiple_elements() {
        assertThat(serialize(List.of("1", "2", "3"))).isEqualTo("1;2;3");
    }

    @Test
    void should_deserialize_list_of_one_element() {
        assertThat(deserialize("1")).hasSize(1).containsExactly("1");
    }

    @Test
    void should_deserialize_list_of_multiple_elements() {
        assertThat(deserialize("1;2;3")).hasSize(3).containsExactly("1", "2", "3");
    }

    @Test
    void should_deserialize_list_with_empty_value() {
        assertThat(deserialize("1;;3")).hasSize(3).containsExactly("1", "", "3");
    }

}