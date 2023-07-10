package com.gberard.tournament.data;

import java.util.Map;

public class DepthOneScore implements Score {

    Map<String, Integer> result;

    public DepthOneScore(Map<String, Integer> result) {
        this.result = result;
    }

    @Override
    public String getSummary() {
        return null;
    }
}