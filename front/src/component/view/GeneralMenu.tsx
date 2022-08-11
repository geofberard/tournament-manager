import { Grid, SxProps, Theme, Typography } from "@mui/material";
import * as React from "react";
import { FC } from "react";
import { Image } from "../atom/Image";

const menuContainer: SxProps = {
    backgroundColor: "primary.dark",
    color: "primary.contrastText",
};

const logoContainer: SxProps = {
    display: "flex",
    alignItems: "center",
};

const titleContainer: SxProps = {
    display: "flex",
    width: "80%",
    justifyContent: "space-evenly",
    paddingBottom: { xs: "0", md: "0"},
    borderBottom: (theme: Theme) => `5px solid ${theme.palette.secondary.main}`,
};

const logo: SxProps = {
    width: { xs: "75px" },
};

export const GeneralMenu: FC = () => (
    <Grid
        container
        item
        direction={{ xs: "row"}}
        justifyContent={{ xs: "space-between"}}
        alignItems={{ xs: "stretch"}}
        sx={menuContainer}
    >
        <Grid item sx={logoContainer}>
            <Image src="img/scuf-logo.svg" alt="SCUF" sx={logo} />
        </Grid>
        <Grid sx={titleContainer} >
            <Typography variant="h3">Tous les matchs</Typography>
            <Typography variant="h3">Classement</Typography>
            <Typography variant="h3">Vos Matchs</Typography>
            <Typography variant="h3">Phases finales</Typography>
        </Grid>
        <Grid item />
    </Grid>
);