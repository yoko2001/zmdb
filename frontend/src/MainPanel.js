import * as React from 'react';
import { Box } from '@mui/material';
import { SearchBox } from './SearchBox';
import { LiveTable } from './LiveTable';

export const MainPanel = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Box sx={{ width: '100%', pb: '2rem'}}>
                <SearchBox />
            </Box>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ flexGrow: 1 }}>
                    <LiveTable />
                </Box>
            </Box>
        </Box>
    );
}