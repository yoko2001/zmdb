import * as React from 'react';
import { Box } from '@mui/material';
import { SearchBox } from './search/SearchBox';
import { Toolbar } from './toolbar/Toolbar';
import { ClipTable } from './clip/ClipTable';

export const MainPanel = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
            <Box sx={{ width: '100%' }}>
                <SearchBox />
            </Box>
            <Box sx={{ width:'100%', mb:'1rem', mt:'1rem', display:'flex', flexDirection:'column', alignItems:'flex-end' }}>
                <Toolbar />
            </Box>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ flexGrow: 1 }}>
                    <ClipTable />
                </Box>
            </Box>
        </Box>
    );
}