import { Grid, SxProps } from "@mui/material";
import * as React from "react";
import { FC } from "react";
import { CompetitionBoard } from "../view/CompetitionBoard";
import { GeneralMenu } from "../view/GeneralMenu";
import { GameList } from "../view/GameList";

const fullScreen: SxProps = {
    height: "100vh",
};

export const WelcomePageTeam: FC = () => {

    return (
        <>
            <Grid container spacing={0} sx={fullScreen}>
                <GeneralMenu />
                <CompetitionBoard />                
                <GameList />
            </Grid>
        </>
    );
};
