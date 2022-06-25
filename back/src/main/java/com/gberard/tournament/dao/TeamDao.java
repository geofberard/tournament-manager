package com.gberard.tournament.dao;

import com.gberard.tournament.config.SpreadsheetConfig;
import com.gberard.tournament.data.Team;
import com.gberard.tournament.service.SheetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TeamDao {

    @Autowired
    SheetService sheetService;

    @Autowired
    private SpreadsheetConfig spreadsheetConfig;

    public List<Team> getTeams(){
        return sheetService.getData(
                spreadsheetConfig.getTeamRange(),
                value -> new Team(value.get(0).toString(), value.get(1).toString()));
    }
}
