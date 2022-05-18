import * as React from 'react';
import { Box } from '@mui/material';
import { Navigator } from './Navigator';

export const SideBar = () => {
    return (
        <Box sx={{  width:'100%', bgcolor: 'background.paper' }}>
            <Navigator />
        </Box>
    );
}