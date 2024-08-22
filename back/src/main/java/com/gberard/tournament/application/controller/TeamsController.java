package com.gberard.tournament.application.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.gberard.tournament.application.dto.*;
import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.Player;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.port.input.PlayerService;
import com.gberard.tournament.domain.port.input.TeamService;
import com.gberard.tournament.domain.port.output.TeamRepository;
import com.gberard.tournament.domain.service.ContestantStatsService;
import jakarta.persistence.EntityNotFoundException;
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
        List<Player> players = findMatchingPlayers(createTeamDTO.players());

        Team newTeam = teamService.create(new Team(null, createTeamDTO.name(), players));

        return ResponseEntity.status(CREATED).body(TeamDTO.toTeamDTO(newTeam));
    }

    @JsonView(Views.TeamView.Full.class)
    @GetMapping("/{id}")
    public ResponseEntity<TeamDTO> getTeam(@PathVariable String id) {
        return ResponseEntity.ok(TeamDTO.toTeamDTO(findMatchingTeam(id)));
    }

    @JsonView(Views.TeamView.Full.class)
    @PutMapping("/{id}")
    public ResponseEntity<TeamDTO> updateTeam(@PathVariable String id, @RequestBody UpdateTeamDTO updateTeamDTO) {
        Team matchingTeam = findMatchingTeam(id);
        List<Player> players = findMatchingPlayers(updateTeamDTO.players());

        Team updatedTeam = teamService.update(new Team(matchingTeam.id(), updateTeamDTO.name(), players));

        return ResponseEntity.ok(TeamDTO.toTeamDTO(updatedTeam));
    }

    @JsonView(Views.TeamView.Full.class)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeam(@PathVariable String id) {
        teamService.delete(findMatchingTeam(id));
        return ResponseEntity.noContent().build();
    }

    @JsonView(Views.TeamView.Full.class)
    @GetMapping("/{id}/stats")
    public Optional<ContestantStatsDTO> getTeamStats(@PathVariable String id) {
        return teamService.findById(id)
                .map(teamStatsService::getContestantStats)
                .map(ContestantStatsDTO::fromContestantStats);
    }

    private Team findMatchingTeam(String id) {
        Optional<Team> matchingGame = teamService.findById(id);

        if(matchingGame.isEmpty()) {
            throw new EntityNotFoundException("Unknown team " + id);
        }

        return matchingGame.get();
    }

    private List<Player> findMatchingPlayers(List<String> playerIds) {
        List<Optional<Player>> potentialPlayers = playerIds.stream()
                .map(playerService::findById)
                .toList();

        if (potentialPlayers.stream().anyMatch(Optional::isEmpty)) {
            List<String> foundPlayers = potentialPlayers.stream()
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .map(Player::id).toList();

            List<String> unknownTeams = playerIds.stream()
                    .filter(teamId -> !foundPlayers.contains(teamId))
                    .toList();

            throw new EntityNotFoundException("Unknown players " + unknownTeams);
        }

        List<Player> players = potentialPlayers.stream()
                .filter(Optional::isPresent)
                .map(Optional::get)
                .toList();
        return players;
    }

}
