package com.gberard.tournament.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "spreadsheet")
public class SpreadsheetConfig {

    private String id;
    private String teamRange;
    private String gameRange;

    public String getId() {
        return id;
    }

    public void setId(String spreadsheetId) {
        this.id = spreadsheetId;
    }

    public String getTeamRange() {
        return teamRange;
    }

    public void setTeamRange(String teamRange) {
        this.teamRange = teamRange;
    }

    public String getGameRange() {
        return gameRange;
    }

    public void setGameRange(String gameRange) {
        this.gameRange = gameRange;
    }
}
