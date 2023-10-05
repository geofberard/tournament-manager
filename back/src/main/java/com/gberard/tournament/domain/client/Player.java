package com.gberard.tournament.domain.client;

public record Player(String id, String firstName, String lastName) implements Contestant {
}