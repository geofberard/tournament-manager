import { CircularProgress, FormControl, InputLabel, Select } from "@mui/material";
import * as React from "react";
import { FC, useEffect, useState } from "react";
import { Team } from "../../data/Team";
import { sortByName } from "../../data/TeamUtils";
import { parseElementId } from "../../service/DataService";
import { fetchTeams } from "../../service/TeamService";
import { useCurrentTeam } from "../hook/CurrentTeamContext";

export const TeamSelector: FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [currentTeam, setCurrentTeam] = useCurrentTeam();

    useEffect(() => {
        fetchTeams().then(setTeams);
    }, []);

    return teams.length === 0 ? (<CircularProgress />) : (
        <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-age-native-simple">Choisir une équipe</InputLabel>
            <Select
                native
                value={currentTeam ? currentTeam.id : ""}
                onChange={event => setCurrentTeam(parseElementId(event.target.value,teams))}
                label="Choisir une équipe">
                <option aria-label="None" value="" />
                {teams
                    .sort(sortByName)
                    .map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
            </Select>
        </FormControl>
    );
};
