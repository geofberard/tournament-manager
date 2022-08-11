import { SxProps, TableRow, TableCell, tableCellClasses, styled } from "@mui/material";
import * as React from "react";
import { FC } from "react";

// const menuContainer: SxProps = {
//     backgroundColor: "primary.dark",
//     color: "primary.contrastText",
// };
const StyledTableCell = styled(TableCell)(({ theme }) => ({
    // [`&.${tableCellClasses.head}`]: {
    //     backgroundColor: theme.palette.common.black,
    //     color: theme.palette.common.white,
    // },
    [`&.${tableCellClasses.body}`]: {
        // fontSize: 14,
        color: theme.palette.common.white,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
}));

export const Game: FC = () => (
    <StyledTableRow
        key={1}
        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
    >
        <StyledTableCell align="center" component="th" scope="row">FT</StyledTableCell>
        <StyledTableCell align="center">Team a</StyledTableCell>
        <StyledTableCell align="center">3 - 0</StyledTableCell>
        <StyledTableCell align="center">Team b</StyledTableCell>
    </StyledTableRow>
);

