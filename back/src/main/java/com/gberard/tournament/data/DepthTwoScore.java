package com.gberard.tournament.data;

import java.util.List;

public class DepthTwoScore implements Score {

    List<DepthOneScore> result;

    public DepthTwoScore(List<DepthOneScore> result) {
        this.result = result;
    }

    @Override
    public String getSummary() {
        return null;
    }
}