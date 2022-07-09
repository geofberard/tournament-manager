import * as React from "react";
import { useState, useEffect } from "react";
import { FC } from "react";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

const theme = createTheme({});

export const RootApp: FC = () => {
    const [teams, setTeams] = useState([]);
    // @ts-ignore
    const api = ENV_API_URL;
    useEffect(() => {
        fetch(`${api}/api/teams`)
            .then((res) => res.json())
            .then(setTeams);
    }, []);
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <div>Hello World !</div>
            {teams.map((team) => (
                <div key={team.id}>{team.name}</div>
            ))}
            <div>Server: {api}</div>
        </ThemeProvider>
    );
};
