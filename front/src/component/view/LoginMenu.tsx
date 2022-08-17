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
    ...logoContainer,
    paddingBottom: { xs: "0", md: "30px" },
    borderBottom: (theme: Theme) => `5px solid ${theme.palette.secondary.main}`,
};

const logo: SxProps = {
    width: { xs: "75px", md: "250px" },
};

export const LoginMenu: FC = () => (
    <Grid
        container
        item
        md={5}
        direction={{ xs: "row", md: "column-reverse" }}
        justifyContent={{ xs: "space-between", md: "center" }}
        alignItems={{ xs: "stretch", md: "center" }}
        sx={menuContainer}
    >
        <Grid item sx={logoContainer}>
            <Image src="/img/scuf-logo.svg" alt="SCUF" sx={logo} />
        </Grid>
        <Grid item sx={titleContainer}>
            <Typography variant="h1">Tournois</Typography>
        </Grid>
        <Grid item />
    </Grid>
);
