package com.gberard.tournament.application.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "spreadsheet")
public class SpreadsheetConfig {

    private String id;

    public String getId() {
        return id;
    }

    public void setId(String spreadsheetId) {
        this.id = spreadsheetId;
    }

}
