import { Grid, SxProps, Typography, Theme } from "@mui/material";
import * as React from "react";
import { FC } from "react";
import { CompetitionBoard } from "../view/CompetitionBoard";
import { GeneralMenu } from "../view/GeneralMenu";
import { GameList } from "../view/GameList";
import { useGames } from "../hook/useGames";

const fullScreen: SxProps = {
    height: "100vh",
};

export const WelcomePageTeam: FC = () => {

    // Pour le moment je récupère tous les matchs mais il faudrais récupérer les matchs de l'équipe sélectionnée.
    // Je les récupère ici car GameList on pourra le réutiliser pour afficher tous les matchs
    const games = useGames();

    return (
        <>
            <Grid container spacing={0} sx={fullScreen}>
                <GeneralMenu />
                <CompetitionBoard />                
                <GameList title="Vos Matchs" games={games}/>
            </Grid>
        </>
    );
};
