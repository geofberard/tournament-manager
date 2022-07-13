import { Grid, SxProps } from "@mui/material";
import * as React from "react";
import { FC } from "react";
import { LoginMenu } from "../view/LoginMenu";
import { TeamSelection } from "../view/TeamSelection";

const fullScreen: SxProps = {
    height: "100vh",
}

export const TeamLogin: FC = () => {
    return (
        <>
            <Grid container
                spacing={0}
                direction={{ xs: 'column', md: "row" }}
                sx={fullScreen}>
                <LoginMenu />
                <TeamSelection />
            </Grid>
        </>
    );
};
