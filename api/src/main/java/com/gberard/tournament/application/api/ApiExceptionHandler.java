package com.gberard.tournament.application.api;

import com.gberard.tournament.domain.exception.TeamInUseException;
import com.gberard.tournament.generated.model.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(TeamInUseException.class)
    public ResponseEntity<ErrorResponse> handleTeamInUse(TeamInUseException exception) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ErrorResponse("TEAM_IN_USE", exception.getMessage()));
    }
}
