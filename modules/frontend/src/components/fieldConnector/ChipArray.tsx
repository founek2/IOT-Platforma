import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import { TextFieldProps } from '@mui/material/TextField';

export default function ChipArray({
    label,
    value: globalValue,
    onChange,
    onBlur,
    onFocus,
    fullWidth,
    error,
    helperText,
    sx,
    required,
    options,
    ...props
}: TextFieldProps & {
    onChange?: (e: { target: { value: string[] } }) => any;
    value: string[];
    options: { value: string; label: string }[];
}) {
    const requiredStar = required ? ' *' : null;

    return (
        <FormControl fullWidth={fullWidth} sx={sx}>
            <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                <List
                    sx={{
                        position: 'relative',
                        overflow: 'auto',
                        maxHeight: 500,
                        '& ul': { padding: 0 },
                    }}
                    subheader={<li />}
                >
                    <li>
                        <ul>
                            {label ? (
                                <ListSubheader>
                                    {label} {requiredStar}
                                </ListSubheader>
                            ) : null}
                            {options
                                .filter((v) => !globalValue.includes(v.value))
                                .map((item) => (
                                    <ListItem key={`item-${item.value}`} disablePadding>
                                        <ListItemButton
                                            dense
                                            onClick={() => {
                                                if (onChange)
                                                    onChange({ target: { value: [...globalValue, item.value] } });
                                            }}
                                        >
                                            <ListItemText primary={item.label} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                        </ul>
                    </li>
                </List>
                <Box sx={{ marginLeft: 1 }}>
                    {options
                        .filter((v) => globalValue.includes(v.value))
                        .map(({ value, label }) => (
                            <Chip
                                key={value}
                                label={label}
                                variant="outlined"
                                onDelete={() => {
                                    if (onChange)
                                        onChange({ target: { value: globalValue.filter((v) => v !== value) } });
                                }}
                            />
                        ))}
                </Box>
            </Box>
            {error ? (
                <FormHelperText sx={{ margin: 0 }} error={error}>
                    {helperText}
                </FormHelperText>
            ) : null}
        </FormControl>
    );
}
