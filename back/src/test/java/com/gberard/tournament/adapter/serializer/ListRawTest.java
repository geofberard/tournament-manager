package com.gberard.tournament.adapter.serializer;

import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class ListRawTest {

    @Test
    void should_serialize_list_of_one_element() {
        Assertions.assertThat(ListRaw.serialize(List.of("1"))).isEqualTo("1");
    }

    @Test
    void should_serialize_list_of_multiple_elements() {
        Assertions.assertThat(ListRaw.serialize(List.of("1", "2", "3"))).isEqualTo("1;2;3");
    }

    @Test
    void should_deserialize_list_of_one_element() {
        Assertions.assertThat(ListRaw.deserialize("1")).hasSize(1).containsExactly("1");
    }

    @Test
    void should_deserialize_list_of_multiple_elements() {
        Assertions.assertThat(ListRaw.deserialize("1;2;3")).hasSize(3).containsExactly("1", "2", "3");
    }

    @Test
    void should_deserialize_list_with_empty_value() {
        Assertions.assertThat(ListRaw.deserialize("1;;3")).hasSize(3).containsExactly("1", "", "3");
    }

}