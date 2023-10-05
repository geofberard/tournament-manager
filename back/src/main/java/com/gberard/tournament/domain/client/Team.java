package com.gberard.tournament.domain.client;

import java.util.List;

public record Team(String id, String name, List<String> playerIds) implements Contestant {
}