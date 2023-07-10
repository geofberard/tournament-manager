package com.gberard.tournament.data;

import java.util.List;

public record DepthTwoScore(List<DepthOneScore> result) implements Score {
    @Override
    public String getSummary() {
        return null;
    }
}