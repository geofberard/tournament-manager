import { CircularProgress, FormControl, InputLabel, Select } from "@mui/material";
import * as React from "react";
import { FC, useEffect, useState } from "react";
import { Team } from "../../data/Team";
import { sortByName } from "../../data/TeamUtils";
import { fetchTeams } from "../../service/TeamService";

export const TeamSelector: FC = () => {
    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        fetchTeams().then(setTeams);
    }, []);

    return teams.length === 0 ? (<CircularProgress />) : (
        <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-age-native-simple">Choisir une équipe</InputLabel>
            <Select
                native
                value={""}
                onChange={event => console.log("Changing team : ", event.target.value)}
                label="Choisir une équipe">
                <option aria-label="None" value="" />
                {teams
                    .sort(sortByName)
                    .map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
            </Select>
        </FormControl>
    );
};
