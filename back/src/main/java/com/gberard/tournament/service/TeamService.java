package com.gberard.tournament.service;

import com.gberard.tournament.config.SpreadsheetConfig;
import com.gberard.tournament.data.Team;
import com.google.common.annotations.VisibleForTesting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

import static com.gberard.tournament.service.SheetService.getValue;
import static java.util.stream.Collectors.*;

@Component
public class TeamService {

    @Autowired
    SheetService sheetService;

    @Autowired
    private SpreadsheetConfig spreadsheetConfig;

    public List<Team> getTeams(){
        return sheetService
                .getData(spreadsheetConfig.getTeamRange())
                .map(this::mapTeam)
                .collect(toList());
    }

    @VisibleForTesting
    protected Team mapTeam(List<Object> rawData) {
        return new Team(getValue(rawData,0), getValue(rawData,1));
    }

    public Optional<Team> getTeam(String teamId) {
        return getTeams().stream()
                .filter(team -> team.id().equals(teamId))
                .findFirst();
    }
}
