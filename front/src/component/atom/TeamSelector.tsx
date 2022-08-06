import { FormControl, InputLabel, Select } from "@mui/material";
import * as React from "react";
import { FC } from "react";
import { sortByName } from "../../data/TeamUtils";
import { findById } from "../../service/DataService";
import { useCurrentTeam } from "../hook/CurrentTeamContext";
import { useTeams } from "../hook/useTeams";

export const TeamSelector: FC = () => {
    const teams = useTeams();
    const [currentTeam, setCurrentTeam] = useCurrentTeam();
    return (
        <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-age-native-simple">Choisir une équipe</InputLabel>
            <Select
                native
                value={currentTeam ? currentTeam.id : ""}
                onChange={event => setCurrentTeam(findById(event.target.value,teams))}
                label="Choisir une équipe">
                <option aria-label="None" value="" />
                {teams
                    .sort(sortByName)
                    .map(team => <option key={team.id} value={team.id}>{team.name}</option>)}
            </Select>
        </FormControl>
    );
};
