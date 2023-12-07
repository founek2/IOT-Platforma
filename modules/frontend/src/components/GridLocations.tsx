
import { Box, BoxProps } from "@mui/material";
import { styled } from '@mui/material/styles';

export const GridLocations = styled(Box)<BoxProps>((props) => ({
    display: 'grid',
    // gridTemplateColumns: 'repeat(1, 1fr)',
    gridTemplateColumns: 'repeat(1, 1fr)',
    gap: props.theme.spacing(1),
    paddingLeft: props.theme.spacing(1),
    paddingRight: props.theme.spacing(1),
    [props.theme.breakpoints.up('xl')]: {
        gridTemplateColumns: 'repeat(auto-fill, minmax(29rem, 1fr))',
        // gap: 4,
    },
    [props.theme.breakpoints.up('lg')]: {
        gridTemplateColumns: 'repeat(auto-fill, minmax(23rem, 1fr))',
        // gap: 3,
        // paddingLeft: 5,
        // paddingRight: 5,
    },
    [props.theme.breakpoints.up('xs')]: {
        gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 1fr))',
        gap: props.theme.spacing(2),
        paddingLeft: props.theme.spacing(2),
        paddingRight: props.theme.spacing(2)
    },
}));