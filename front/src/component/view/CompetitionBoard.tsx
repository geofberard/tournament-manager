import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Badge, Grid } from "@mui/material";
import * as React from "react";
import { FC } from "react";
import { useCurrentTeam } from "../hook/CurrentTeamContext";
import { useTeams } from "../hook/useTeams";


export const CompetitionBoard: FC = () => {

    const teams = useTeams();
    const [currentTeam,] = useCurrentTeam();

    return (
        <Grid
            container
            item
            md={8}
            flexGrow={1}
            direction="column"
            justifyContent="center"
            alignItems="center"
        >
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">#</TableCell>
                            <TableCell align="center">Equipes</TableCell>
                            <TableCell align="center">P</TableCell>
                            <TableCell align="center">W</TableCell>
                            <TableCell align="center">L</TableCell>
                            <TableCell align="center">Pts</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {teams.map((team, index) => (
                            <TableRow
                            key={team.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            selected={(team.id == currentTeam.id) ? true : false}
                            >
                                <TableCell align="center" component="th" scope="row">
                                    <Badge badgeContent={index + 1} ></Badge>
                                </TableCell>
                                <TableCell align="center">{team.name}</TableCell>
                                <TableCell align="center">0</TableCell>
                                <TableCell align="center">0</TableCell>
                                <TableCell align="center">0</TableCell>
                                <TableCell align="center">0 pts</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Grid>
    );
};