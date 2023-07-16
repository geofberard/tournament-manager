package com.gberard.tournament.data;

import java.util.List;

public record Team(String id, String name, List<String> playerIds) implements Contestant {
    @Override
    public String getLabel() {
        return name;
    }
}