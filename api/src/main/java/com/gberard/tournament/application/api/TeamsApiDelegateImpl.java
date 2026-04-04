package com.gberard.tournament.application.api;

import static org.springframework.http.HttpStatus.CREATED;

import com.gberard.tournament.application.mapper.TeamMapper;
import com.gberard.tournament.domain.port.input.TeamService;
import com.gberard.tournament.generated.api.TeamsApiDelegate;
import com.gberard.tournament.generated.model.CreateTeamRequest;
import com.gberard.tournament.generated.model.Team;
import com.gberard.tournament.generated.model.UpdateTeamRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

import jakarta.persistence.EntityNotFoundException;

@Service
public class TeamsApiDelegateImpl implements TeamsApiDelegate {

    @Autowired
    public TeamService teamService;

    @Override
    public ResponseEntity<Team> createTeam(CreateTeamRequest createTeamRequest) {
        var newTeam = teamService.create(TeamMapper.toDomain(createTeamRequest));

        return ResponseEntity.status(CREATED).body(TeamMapper.toApi(newTeam));
    }

    @Override
    public ResponseEntity<Void> deleteTeam(String teamId) {
        teamService.delete(findTeamOrThrow(teamId));
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Team> getTeamById(String teamId) {
        return ResponseEntity.ok(TeamMapper.toApi(findTeamOrThrow(teamId)));
    }

    @Override
    public ResponseEntity<List<Team>> listTeams() {
        var teams = teamService.findAll().stream()
                .map(TeamMapper::toApi)
                .toList();
        return ResponseEntity.ok(teams);
    }

    @Override
    public ResponseEntity<Team> updateTeam(String teamId, UpdateTeamRequest updateTeamRequest) {
        findTeamOrThrow(teamId);

        var updatedTeam = teamService.update(TeamMapper.toDomain(teamId, updateTeamRequest));

        return ResponseEntity.ok(TeamMapper.toApi(updatedTeam));
    }

    private com.gberard.tournament.domain.model.Team findTeamOrThrow(String id) {
        return teamService.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Unknown team " + id));
    }

}