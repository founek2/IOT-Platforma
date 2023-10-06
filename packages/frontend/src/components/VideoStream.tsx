import { Box, CardMedia, CircularProgress, CircularProgressProps } from "@mui/material"
import { grey } from "@mui/material/colors";
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

    return <Box position="relative">
        {loaded ? null : <Loader />}
        <CardMedia component="video" src={src} autoPlay onLoadedData={() => setLoaded(true)} sx={{ background: grey[300] }} />
    </Box>
}