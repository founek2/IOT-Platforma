import { Box, Grid, Skeleton } from "@mui/material"
import React from "react"
import { GridLocations } from "../components/GridLocations"
import { GridRoom } from "../components/GridRoom"

export function RoomLoader() {

    return <>

        <Skeleton variant="rectangular" width={200} height={35} sx={{ margin: "0 auto", mb: 1, mt: 1 }} />

        <Grid container justifyContent="center">
            <Grid item xs={12} md={7} lg={6} xl={5}>
                <GridRoom>
                    <Skeleton variant="rectangular" width="216" height={112} />
                    <Skeleton variant="rectangular" width="216" height={112} />
                    <Skeleton variant="rectangular" width="216" height={112} />
                    <Skeleton variant="rectangular" width="216" height={112} />
                    <Skeleton variant="rectangular" width="216" height={112} />
                    <Skeleton variant="rectangular" width="216" height={112} />
                    <Skeleton variant="rectangular" width="216" height={112} />
                </GridRoom>
            </Grid>
        </Grid>
    </>
}