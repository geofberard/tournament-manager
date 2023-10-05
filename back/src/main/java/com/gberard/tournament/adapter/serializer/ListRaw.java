package com.gberard.tournament.adapter.serializer;

import java.util.Arrays;
import java.util.List;

import static java.util.stream.Collectors.joining;

public final class ListRaw {

    public static final String LIST_SEPARATOR = ";";

    public static String serialize(List<String> elements) {
        return elements.stream().collect(joining(LIST_SEPARATOR));
    }

    public static List<String> deserialize(String rawList) {
        return Arrays.stream(rawList.split(LIST_SEPARATOR)).toList();
    }

}