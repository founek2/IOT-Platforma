import { CardMedia, CircularProgress, CircularProgressProps, Paper } from "@mui/material"
import React, { useState } from "react"
import { styled } from '@mui/material/styles';

const Loader = styled(CircularProgress)<CircularProgressProps>({
    position: "absolute",
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    top: 'calc(50% - 20px)',
});

interface VideoStreamProps {
    src: string
}
export function VideoStream({ src }: VideoStreamProps) {
    const [loaded, setLoaded] = useState(false)

    return <Paper sx={{ position: "relative" }}>
        {loaded ? null : <Loader />}
        <CardMedia component="video" src={src} autoPlay onLoadedData={() => setLoaded(true)} />
    </Paper>
}