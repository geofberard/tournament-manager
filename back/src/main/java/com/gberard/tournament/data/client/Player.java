package com.gberard.tournament.data.client;

public record Player(String id, String firstName, String lastName) implements Contestant {
}