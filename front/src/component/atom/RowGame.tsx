import { SxProps, TableRow, TableCell, tableCellClasses, styled } from "@mui/material";
import * as React from "react";
import { FC } from "react";
import { Game } from "../../data/Game";
import { gamePlayed, winner, checkWinner } from "../../data/GameUtils";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.body}`]: {
        color: theme.palette.common.white,
    },
}));

export interface GameProps {
    game: Game;
}

export const RowGame: FC<GameProps> = ({game}) => (
    <TableRow
        key={1}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
        <StyledTableCell align="center">{(gamePlayed(game)) ? 'FT'  : game.time}</StyledTableCell>
        <StyledTableCell align="center" style={ checkWinner(game, game.teamA) }>{game.teamA}</StyledTableCell>
        <StyledTableCell align="center">{(gamePlayed(game)) ? game.scoreA + ' - ' + game.scoreB : game.court }</StyledTableCell>
        <StyledTableCell align="center" style={ checkWinner(game, game.teamB) }>{game.teamB}</StyledTableCell>
    </TableRow>
);

