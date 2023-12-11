import { Grid, Skeleton } from "@mui/material"
import React from "react"

export function SecurityLoader() {
    return <Grid container maxWidth={600} spacing={1}>
        <Grid item>
            <Skeleton variant="rectangular" height={76} width={600} />
        </Grid>
        <Grid item>
            <Skeleton variant="rectangular" height={76} width={600} />
        </Grid>
        <Grid item>
            <Skeleton variant="rectangular" height={76} width={600} />
        </Grid>
        <Grid item>
            <Skeleton variant="rectangular" height={76} width={600} />
        </Grid>
        <Grid item>
            <Skeleton variant="rectangular" height={76} width={600} />
        </Grid>
        <Grid item>
            <Skeleton variant="rectangular" height={76} width={600} />
        </Grid>
    </Grid>
}