import React from 'react';
import { TextFieldProps } from '@mui/material/TextField';
import { Box, Chip, FormControl, FormHelperText, List, ListItem, ListItemButton, ListItemText, ListSubheader } from '@mui/material';

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
