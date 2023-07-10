package com.gberard.tournament.data;

import java.util.Map;

public record DepthOneScore(Map<String, Integer> result) implements Score {
    @Override
    public String getSummary() {
        return null;
    }
}