package com.gberard.tournament.application.dto;

import java.util.List;

public record UpdateTeamDTO(String name,
                            List<String> players) {
}
