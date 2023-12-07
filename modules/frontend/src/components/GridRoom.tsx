
import { Box, BoxProps } from "@mui/material";
import { styled } from '@mui/material/styles';

export const GridRoom = styled(Box)<BoxProps>((props) => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(8rem, 1fr))',
    gap: props.theme.spacing(2),
    paddingLeft: props.theme.spacing(2),
    paddingRight: props.theme.spacing(2),

    [props.theme.breakpoints.up('md')]: {
        gridTemplateColumns: 'repeat(auto-fill, minmax(12rem, 1fr))',
    },
}));