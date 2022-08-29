package com.gberard.tournament.service;

import com.gberard.tournament.config.SpreadsheetConfig;
import com.gberard.tournament.data.Team;
import com.google.common.annotations.VisibleForTesting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

import static com.gberard.tournament.data.DataUtils.getValue;
import static java.util.stream.Collectors.*;

@Component
public class TeamService {

    @Autowired
    SheetService sheetService;

    @Autowired
    private SpreadsheetConfig spreadsheetConfig;

    public boolean addTeam(Team team) {
        return sheetService.create(spreadsheetConfig.getTeamRange(), toRawData(team));
    }

    public List<Team> getTeams(){
        return sheetService
                .readAll(spreadsheetConfig.getTeamRange())
                .map(this::toTeam)
                .collect(toList());
    }

    public Optional<Team> getTeam(String teamId) {
        return getTeams().stream()
                .filter(team -> team.id().equals(teamId))
                .findFirst();
    }

    public boolean deleteAll() {
        return sheetService.deleteAll(spreadsheetConfig.getTeamRange());
    }

    @VisibleForTesting
    protected Team toTeam(List<Object> rawData) {
        return new Team(getValue(rawData,0), getValue(rawData,1));
    }

    @VisibleForTesting
    protected List<Object> toRawData(Team team) {
        return List.of(team.id(),team.name());
    }

}
