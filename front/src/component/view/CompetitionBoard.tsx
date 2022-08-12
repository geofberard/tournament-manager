import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Badge, Grid, tableCellClasses, styled, SxProps, Typography, Theme} from "@mui/material";
import * as React from "react";
import { FC } from "react";
import { useCurrentTeam } from "../hook/CurrentTeamContext";
import { useTeams } from "../hook/useTeams";

const boardContainer: SxProps = {
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.common.white,
    },
}));

export const CompetitionBoard: FC = () => {

    const teams = useTeams();
    const [currentTeam,] = useCurrentTeam();

    return (
        <Grid
            container
            item
            md={7}
            flexGrow={1}
            direction="column"
            sx={boardContainer}
        >
            <Grid item sx={titleContainer}>
                <Typography variant="h3">Classement</Typography>
            </Grid>

            <TableContainer style={{borderRadius: "15px"}}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="center">#</StyledTableCell>
                            <StyledTableCell align="center">Equipes</StyledTableCell>
                            <StyledTableCell align="center">P</StyledTableCell>
                            <StyledTableCell align="center">W</StyledTableCell>
                            <StyledTableCell align="center">L</StyledTableCell>
                            <StyledTableCell align="center">Pts</StyledTableCell>
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