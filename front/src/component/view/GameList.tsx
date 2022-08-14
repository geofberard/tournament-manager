import { Grid, SxProps, TableContainer, Table, TableBody, Typography, Theme} from "@mui/material";
import * as React from "react";
import { FC } from "react";
import Game from "../../data/Game";
import { RowGame } from "../atom/RowGame";
import { useTeams } from "../hook/useTeams";

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

export const GameList: FC = () => {
    const teams = useTeams();

    const games = [
        new Game("Game 1", new Date("2022-01-01 11:00") , "Terrain 1", teams[0], teams[1], undefined, 25, 7),
        new Game("Game 2", new Date("2022-01-01 12:00"), "Terrain 3", teams[0], teams[2], undefined, 12, 25),
        new Game("Game 3", new Date("2022-01-01 13:00"), "Terrain 2", teams[0], teams[3], undefined, 22, 22),
        new Game("Game 4", new Date("2022-01-01 14:00"), "Terrain 4", teams[0], teams[4]),
        new Game("Game 5", new Date("2022-01-01 15:00"), "Terrain 1", teams[0], teams[5]),
        new Game("Game 6", new Date("2022-01-01 16:00"), "Terrain 2", teams[0], teams[6]),
    ];

    return (
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
};
