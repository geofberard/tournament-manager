package com.gberard.tournament.domain.model;

import java.util.Objects;

public final class Phase implements Identified {
    private final String id;
    private final String name;
    private final String details;
    private final Integer order;
    private final PhaseType type;

    public Phase(String id, String name, String details, Integer order, PhaseType type) {
        this.id = id;
        this.name = Objects.requireNonNull(name, "name must not be null");
        this.details = details;
        this.order = Objects.requireNonNull(order, "order must not be null");
        this.type = Objects.requireNonNull(type, "type must not be null");
    }

    @Override
    public String id() {
        return id;
    }

    public String name() {
        return name;
    }

    public String details() {
        return details;
    }

    public Integer order() {
        return order;
    }

    public PhaseType type() {
        return type;
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof Phase phase)) {
            return false;
        }
        return Objects.equals(id, phase.id)
                && Objects.equals(name, phase.name)
                && Objects.equals(details, phase.details)
                && Objects.equals(order, phase.order)
                && type == phase.type;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, details, order, type);
    }

    @Override
    public String toString() {
        return "Phase[" +
                "id=" + id +
                ", name=" + name +
                ", details=" + details +
                ", order=" + order +
                ", type=" + type +
                ']';
    }
}
