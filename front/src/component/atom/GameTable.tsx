import * as React from "react";
import { FC } from "react";
import { GameRow } from "./GameRow";
import Game from "../../data/Game";
import { TableContainer, Table, TableBody} from "@mui/material";

export interface GameTableProps {
    games: Array<Game>;
}

export const GameTable: FC<GameTableProps> = ({games}) => {

    return (
        <TableContainer >
            <Table>
                <TableBody>
                    {games.map((game, index) => (
                        <GameRow key={index} game={game} />
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
