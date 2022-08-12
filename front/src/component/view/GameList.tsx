import { Grid, SxProps, TableContainer, Table, TableBody, Typography, Theme} from "@mui/material";
import * as React from "react";
import { FC } from "react";
import { RowGame } from "../atom/RowGame";

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

function createData(
    id: string,
    time: string,
    court: string,
    teamA: string,
    teamB: string,
    referee?: string,
    scoreA?: number,
    scoreB?: number
) {
    return {id, time, court, teamA, teamB, referee, scoreA, scoreB };
}

const games = [
    createData("Game 1", '11:00', "Terrain 1", "Les Pilou-Pilou", "Les Baby Sharkies", "", 25, 7),
    createData("Game 2", '12:00', "Terrain 3", "Les Pilou-Pilou", "Les Mercenaires", "", 12, 25),
    createData("Game 3", '13:00', "Terrain 2", "Les Pilou-Pilou", "Les 4 Fantastiques", "", 22, 22),
    createData("Game 4", '14:00', "Terrain 4", "Les Pilou-Pilou", "L'équipe en carton", "", 0, 0),
    createData("Game 5", '15:00', "Terrain 1", "Les Pilou-Pilou", "Les Volley Fenêtre", "", 0, 0),
    createData("Game 6", '16:00', "Terrain 2", "Les Pilou-Pilou", "Les Viking", "", 0, 0),
];

export const GameList: FC = () => (
    <Grid
        container
        item
        md={5}
        direction={{ xs: "row", md: "column" }}
        sx={gameContainer}
    >
        <Grid item sx={titleContainer}>
            <Typography variant="h3">Vos Matchs</Typography>
        </Grid>
        <TableContainer >
            <Table>
                <TableBody>
                    {games.map((game, index) => (
                        <RowGame key={index} game={game} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </Grid>
);
