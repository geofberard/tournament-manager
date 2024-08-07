package com.gberard.tournament.application.dto;

import java.util.List;

public record CreateTeamDTO(String name,
                            List<String> players) {
}
