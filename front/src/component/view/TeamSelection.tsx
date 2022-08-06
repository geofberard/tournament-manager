import { Card, CardContent, CardMedia, CircularProgress, Grid } from "@mui/material";
import * as React from "react";
import { FC, Suspense } from "react";
import { TeamSelector } from "../atom/TeamSelector";

export const TeamSelection: FC = () => {
    return (
        <Grid container item md={7}
            flexGrow={1}
            direction="column"
            justifyContent="center"
            alignItems="center">
            <Card sx={{ maxWidth: "400px" }} elevation={5}>
                <CardMedia
                    component="img"
                    alt="VolleyBall"
                    image="img/scuf-miniature.png"
                    title=""
                />
                <CardContent sx={{ textAlign: "center" }}>
                    <Suspense fallback={<CircularProgress />} >
                        <TeamSelector />
                    </Suspense>
                </CardContent>
            </Card>
        </Grid>
    );
};
