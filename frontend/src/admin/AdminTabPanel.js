import * as React from 'react';
import { Box, Typography } from '@mui/material';

export const AdminTabPanel = ({ children, index, selectedIndex }) => {

    return (
        <div
            role="tabpanel"
            hidden={selectedIndex !== index}
            id={`admin-tabpanel-${index}`}
            aria-labelledby={`admin-tabpanel-${index}`}
        >
            {
                selectedIndex === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>

                )
            }
        </div>
    )
}