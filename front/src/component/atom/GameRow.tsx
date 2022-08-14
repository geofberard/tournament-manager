import { TableRow, TableCell, tableCellClasses, styled } from "@mui/material";
import * as React from "react";
import { FC } from "react";
import Game from "../../data/Game";
import { Team } from "../../data/Team";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.body}`]: {
        color: theme.palette.common.white,
    },
}));

const setStyleTeam = (game: Game, team: Team) => {
    switch (game.getResultGameByTeam(team)) {
        case "WON":
            return {color: "green"};
        case "NOT_PLAYED":
            return {color: "white"};
        case "DEUCE":
            return {color: "orange"};
        case "LOST":
            return {color: "grey"};
    }
};

export interface GameProps {
    game: Game;
}

export const GameRow: FC<GameProps> = ({game}) => {
    return (
        <TableRow
            key={1}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
            <StyledTableCell align="center">{(game.isFinished()) ? 'FT'  : game.time.toLocaleTimeString()}</StyledTableCell>
            <StyledTableCell align="center" style={ setStyleTeam(game, game.teamA) }>{game.teamA.name}</StyledTableCell>
            <StyledTableCell align="center">{(game.isFinished()) ? game.scoreA + ' - ' + game.scoreB : game.court }</StyledTableCell>
            <StyledTableCell align="center" style={ setStyleTeam(game, game.teamB) }>{game.teamB.name}</StyledTableCell>
        </TableRow>
    );
};

