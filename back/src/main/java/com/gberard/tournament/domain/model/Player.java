package com.gberard.tournament.domain.model;

public record Player(String id, String firstName, String lastName) implements Contestant {
}
