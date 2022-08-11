import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import { FC } from "react";
import { CurrentTeamProvider } from "../hook/CurrentTeamContext";
import { TeamLogin } from "../page/TeamLogin";
import { WelcomePageTeam } from "../page/WelcomePageTeam";
import * as TeamService from "../../service/TeamService";

const defaultTheme = createTheme();
const theme = createTheme(defaultTheme, {
    palette: {
        primary: {
            light: "#484848",
            main: "#212121",
            dark: "#000000",
            contrastText: "#ffffff",
        },
        secondary: {
            light: "#ffeb90",
            main: "#dcb961",
            dark: "#a88933",
            contrastText: "#000000",
        },
    },
    typography: {
        fontFamily: ['"Montserrat"', "Sans-serif"].join(","),
        h1: {
            fontSize: "2rem",
            fontWeight: 900,
            [defaultTheme.breakpoints.up("md")]: {
                fontSize: "2.8rem",
            },
        },
        h2: {
            fontSize: "2rem",
            fontWeight: 900,
        },
        h3: {
            fontSize: "1.3rem",
            fontWeight: 900,
            alignSelf: "center",
            [defaultTheme.breakpoints.up("md")]: {
                fontSize: "1.7rem",
            },
        },
    },
});

const currentTeam = TeamService.getCurrentTeam();

export const RootApp: FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <CurrentTeamProvider>
                {currentTeam ? <WelcomePageTeam /> : <TeamLogin />}
            </CurrentTeamProvider>
        </ThemeProvider>
    );
};
