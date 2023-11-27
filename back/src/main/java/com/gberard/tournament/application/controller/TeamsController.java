package com.gberard.tournament.application.controller;

import com.gberard.tournament.application.response.TeamDTO;
import com.gberard.tournament.application.response.TeamDTOMapper;
import com.gberard.tournament.infrastructure.repository.SheetTeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
public class TeamsController {

    @Autowired
    public SheetTeamRepository teamService;

    @GetMapping("/teams")
    public List<TeamDTO> getTeams() {
        return teamService.readAll().stream()
                .map(TeamDTOMapper::toTeamDTO)
                .toList();
    }

    @GetMapping("/teams/{id}")
    public TeamDTO getTeam(@PathVariable String id) {
        return teamService.search(id)
                .map(TeamDTOMapper::toTeamDTO)
                .get();
    }

}
