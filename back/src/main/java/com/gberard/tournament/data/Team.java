package com.gberard.tournament.data;

import java.util.List;

public record Team(String id, String name, List<Player> players) implements Contestant {
    @Override
    public String label() {
        return name;
    }
}