package com.gberard.tournament.service;

import com.gberard.tournament.config.SpreadsheetConfig;
import com.gberard.tournament.data.Team;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

@Component
public class TeamService {

    @Autowired
    SheetService sheetService;

    @Autowired
    private SpreadsheetConfig spreadsheetConfig;

    public List<Team> getTeams(){
        return sheetService.getData(
                spreadsheetConfig.getTeamRange(),
                value -> new Team(value.get(0).toString(), value.get(1).toString()));
    }

    public Optional<Team> getTeam(String teamId) {
        return getTeams().stream()
                .filter(team -> team.id().equals(teamId))
                .findFirst();
    }
}
