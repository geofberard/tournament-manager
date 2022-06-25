package com.gberard.tournament.service;

import com.gberard.tournament.dao.TeamDao;
import com.gberard.tournament.data.Team;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class TeamService {

    @Autowired
    private TeamDao teamDao;

    public List<Team> getTeams(){
        return teamDao.getTeams();
    }
}
