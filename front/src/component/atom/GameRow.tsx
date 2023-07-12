import { TableRow, TableCell, tableCellClasses, styled } from "@mui/material";
import * as React from "react";
import { FC } from "react";
import Game from "../../data/Game";
import { Team } from "../../data/Team";
import {Contestant} from "../../data/Contestant";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.body}`]: {
        color: theme.palette.common.white,
    },
}));

const setStyleTeam = (game: Game, contestant: Contestant) => {
    switch (game.getResultGameByTeam(contestant)) {
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

// @Patator : a rendre moins static "teamA teamB", construire intelligemment à partir de la listes constestant
export const GameRow: FC<GameProps> = ({game}) => {

    const date = new Date(game.time);
    const contestantA = game.contestants[0];
    const contestantB = game.contestants[1];

    return (
        <>
            <TableRow
                key={1}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                className="row-game"
                >
                <StyledTableCell align="center">{(game.isFinished) ? "FT"  : date.toLocaleTimeString(undefined, {hour:"2-digit", minute:"2-digit"})}</StyledTableCell>
                <StyledTableCell className="teamA-cell" align="center" style={ setStyleTeam(game, contestantA) }>{contestantA.label}</StyledTableCell>
                <StyledTableCell align="center">{(game.isFinished) ? game.score.summary : game.court }</StyledTableCell>
                <StyledTableCell className="teamB-cell" align="center" style={ setStyleTeam(game, contestantB) }>{contestantB.label}</StyledTableCell>
            </TableRow>
        </>
    );
};

