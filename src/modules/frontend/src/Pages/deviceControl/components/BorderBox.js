import React, { Fragment, useState } from 'react'
import Box from '@material-ui/core/Box';

const defaultProps = {
    bgcolor: 'background.paper',
    m: 1,
    border: 1,
    style: { padding: "1rem", textAlign: "center" },
};

export default function ({ children }) {
    return (<Box display="inline-block" borderRadius={10} borderColor="grey.400" {...defaultProps}>
        {children}
    </Box>)
}