package com.gberard.tournament.data;

public record Player(String id, String firstName, String lastName) implements Contestant {
    @Override
    public String getLabel() {
        return firstName + " " + lastName;
    }
}