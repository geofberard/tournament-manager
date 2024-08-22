package com.gberard.tournament.application.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.gberard.tournament.application.dto.*;
import com.gberard.tournament.domain.model.Player;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.port.input.PlayerService;
import com.gberard.tournament.domain.port.input.TeamService;
import com.gberard.tournament.domain.port.output.TeamRepository;
import com.gberard.tournament.domain.service.ContestantStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/teams")
public class TeamsController {

    @Autowired
    public TeamService teamService;

    @Autowired
    public PlayerService playerService;

    @Autowired
    public ContestantStatsService teamStatsService;

    @JsonView(Views.TeamView.Full.class)
    @GetMapping
    public ResponseEntity<List<TeamDTO>> getTeams() {
        List<TeamDTO> teams = teamService.findAll().stream()
                .map(TeamDTO::toTeamDTO)
                .toList();
        return ResponseEntity.ok(teams);
    }

    @JsonView(Views.TeamView.Full.class)
    @PostMapping
    public ResponseEntity<TeamDTO> createPlayers(@RequestBody CreateTeamDTO createTeamDTO) {
        List<Player> players = createTeamDTO.players().stream()
                .map(playerService::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .toList();

        Team newTeam = teamService.create(new Team(null, createTeamDTO.name(), players));
        return ResponseEntity.status(CREATED).body(TeamDTO.toTeamDTO(newTeam));
    }

    @JsonView(Views.TeamView.Full.class)
    @GetMapping("/{id}")
    public ResponseEntity<TeamDTO> getTeam(@PathVariable String id) {
        return teamService.findById(id)
                .map(TeamDTO::toTeamDTO)
                .map(ResponseEntity::ok)
                .orElseGet(ResponseEntity.status(NOT_FOUND)::build);
    }

    @JsonView(Views.TeamView.Full.class)
    @PutMapping("/{id}")
    public ResponseEntity<TeamDTO> updateTeam(@PathVariable String id, @RequestBody UpdateTeamDTO updateTeamDTO) {
        List<Player> players = updateTeamDTO.players().stream()
                .map(playerService::findById)
                .filter(Optional::isPresent)
                .map(Optional::get)
                .toList();

        Optional<Team> updatedTeam = teamService.findById(id)
                .map(Team::id)
                .map(existingId -> new Team(existingId, updateTeamDTO.name(), players))
                .map(teamService::update);

        return updatedTeam.map(TeamDTO::toTeamDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(NOT_FOUND).build());
    }

    @JsonView(Views.TeamView.Full.class)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable String id) {
        return teamService.findById(id)
                .map(teamService::delete)
                .map(_ -> new ResponseEntity<Void>(HttpStatus.NO_CONTENT))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @JsonView(Views.TeamView.Full.class)
    @GetMapping("/{id}/stats")
    public Optional<ContestantStatsDTO> getTeamStats(@PathVariable String id) {
        return teamService.findById(id)
                .map(teamStatsService::getContestantStats)
                .map(ContestantStatsDTO::fromContestantStats);
    }

}
