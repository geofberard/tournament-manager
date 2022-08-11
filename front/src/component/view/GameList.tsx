import { Grid, SxProps, TableContainer, Table, TableBody, Typography, Theme} from "@mui/material";
import * as React from "react";
import { FC } from "react";
import { Game } from "../atom/Game";

const menuContainer: SxProps = {
    backgroundColor: "primary.dark",
    color: "primary.contrastText",
    paddingLeft: { xs: "0", md: "15px" }, 
    paddingRight: { xs: "0", md: "15px" }, 
};

const titleContainer: SxProps = {
    display: "flex",
    justifyContent: "center",
    paddingTop: "10px" ,
    paddingBottom: { xs: "0", md: "10px" },
    borderBottom: (theme: Theme) => `5px solid ${theme.palette.secondary.main}`,
};

function createData(
    time: string,
    court: string,
    teamA: string,
    teamB: string,
    referee?: string,
    scoreA?: number,
    scoreB?: number
) {
    return { time, court, teamA, teamB, referee, scoreA, scoreB };
}

const games = [
    createData('11:00', "Terrain 1", "Les Pilou-Pilou", "Les Baby Sharkies", "", 25, 7),
    createData('12:00', "Terrain 3", "Les Pilou-Pilou", "Les Mercenaires", "", 12, 25),
    createData('13:00', "Terrain 2", "Les Pilou-Pilou", "Les 4 Fantastiques", "", 0, 0),
    createData('14:00', "Terrain 4", "Les Pilou-Pilou", "L'équipe en carton", "", 0, 0),
    createData('15:00', "Terrain 1", "Les Pilou-Pilou", "Les Volley Fenêtre", "", 0, 0),
    createData('16:00', "Terrain 2", "Les Pilou-Pilou", "Les Viking", "", 0, 0),
];

export const GameList: FC = () => (
    <Grid
        container
        item
        md={4}
        direction={{ xs: "row", md: "column" }}
        justifyContent={ "center" }
        alignItems={ "center" }
        sx={menuContainer}
    >
        <Grid item sx={titleContainer}>
            <Typography variant="h1">Vos Matchs</Typography>
        </Grid>
        <TableContainer >
            <Table>
                <TableBody>
                {/* {games.map((game, index) => (
                    <Game gameInfo={game} />
                ))} */}
                    <Game  />
                    <Game  />
                    <Game  />
                    <Game  />
                </TableBody>
            </Table>
        </TableContainer>
    </Grid>
);
