import { Grid, SxProps, Typography, Theme} from "@mui/material";
import * as React from "react";
import { FC } from "react";
import Game from "../../data/Game";
import { GameTable } from "../atom/GameTable";

const gameContainer: SxProps = {
    backgroundColor: "primary.dark",
    color: "primary.contrastText",
    paddingLeft: { xs: "0", md: "15px" }, 
    paddingRight: { xs: "0", md: "15px" }, 
};

const titleContainer: SxProps = {
    maxWidth: "300px",
    margin: "0 auto",
    marginBottom: "5px",
    paddingTop: "10px" ,
    paddingBottom: { xs: "0", md: "10px" },
    borderBottom: (theme: Theme) => `5px solid ${theme.palette.secondary.main}`,
};

export interface GameListProps {
    title: string;
    games: Array<Game>;
}

export const GameList: FC<GameListProps> = ({title, games}) => {
    return (
        <Grid
            container
            item
            md={5}
            direction={{ xs: "row", md: "column" }}
            sx={gameContainer}
        >
            <Grid item sx={titleContainer}>
                <Typography variant="h3">{title}</Typography>
            </Grid>
            <GameTable games={games}/>
        </Grid>
    );
};
