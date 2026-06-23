package com.gberard.tournament.application.api;

import com.gberard.tournament.domain.exception.PhaseHierarchyCycleException;
import com.gberard.tournament.domain.exception.PhaseHasChildrenException;
import com.gberard.tournament.domain.exception.PhaseInUseException;
import com.gberard.tournament.domain.exception.TeamInUseException;
import com.gberard.tournament.generated.model.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(PhaseHasChildrenException.class)
    public ResponseEntity<ErrorResponse> handlePhaseHasChildren(PhaseHasChildrenException exception) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("PHASE_HAS_CHILDREN", exception.getMessage()));
    }

    @ExceptionHandler(PhaseHierarchyCycleException.class)
    public ResponseEntity<ErrorResponse> handlePhaseHierarchyCycle(PhaseHierarchyCycleException exception) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("PHASE_HIERARCHY_CYCLE", exception.getMessage()));
    }

    @ExceptionHandler(TeamInUseException.class)
    public ResponseEntity<ErrorResponse> handleTeamInUse(TeamInUseException exception) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("TEAM_IN_USE", exception.getMessage()));
    }

    @ExceptionHandler(PhaseInUseException.class)
    public ResponseEntity<ErrorResponse> handlePhaseInUse(PhaseInUseException exception) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("PHASE_IN_USE", exception.getMessage()));
    }
}
